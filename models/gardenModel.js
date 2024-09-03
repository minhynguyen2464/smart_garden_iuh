const db = require('../config/firebaseConfig');
const {
	ref,
	get,
	query,
	orderByKey,
	limitToLast,
	child,
	update,
} = require('firebase/database'); // Ensure correct imports

/**
 * Method to get humidity and temperature from the 'sensors' node
 * @returns {Promise<Object>} - Returns the sensor values from Firebase
 * @throws {Error} - Throws an error if data retrieval fails
 */
const getSensorValues = async () => {
	const dbRef = ref(db);
	try {
		const snapshot = await get(child(dbRef, 'sensors'));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error('No data available');
		}
	} catch (error) {
		throw new Error('Error retrieving sensor data: ' + error.message);
	}
};

/**
 * Method to get the latest sensor data from the 'sensors' node
 * @returns {Promise<Object>} - Returns an object containing the latest timestamp and associated data
 * @throws {Error} - Throws an error if data retrieval fails
 */
const getLatestSensorData = async () => {
	const dbRef = ref(db, 'sensors'); // Reference to the 'sensors' node

	try {
		const snapshot = await get(dbRef);
		if (snapshot.exists()) {
			const data = snapshot.val();
			// Extract the latest timestamp
			const timestamps = Object.keys(data);
			const latestTimestamp = timestamps.reduce((latest, current) => {
				return new Date(current) > new Date(latest) ? current : latest;
			});
			// Return the latest timestamp and its associated data
			return {
				timestamp: latestTimestamp,
				data: data[latestTimestamp],
			};
		} else {
			throw new Error('No data available');
		}
	} catch (error) {
		throw new Error('Error retrieving sensor data: ' + error.message);
	}
};

/**
 * Method to get the latest 5 sensor data entries from the 'sensors' node
 * @returns {Promise<Object>} - Returns an object containing arrays of the last 5 timestamps, temperatures, humidities, and soil moistures
 * @throws {Error} - Throws an error if data retrieval fails
 */
const getLatest5SensorData = async () => {
	const dbRef = ref(db, 'sensors');
	const latestQuery = query(dbRef, orderByKey(), limitToLast(5));

	try {
		const snapshot = await get(latestQuery);
		if (snapshot.exists()) {
			const data = snapshot.val();

			// Create arrays to hold the values
			const temperatures = [];
			const humidities = [];
			const soilMoistures = [];
			const timestamps = [];

			// Extract values and push to the arrays
			Object.entries(data).forEach(([timestamp, record]) => {
				if (record.temperature !== undefined)
					temperatures.push(record.temperature);
				if (record.humidity !== undefined) humidities.push(record.humidity);
				if (record.soilMoisture !== undefined)
					soilMoistures.push(record.soilMoisture);
				timestamps.push(timestamp);
			});

			// Reverse arrays to get the latest values in order
			return {
				timestamps: timestamps,
				temperatures: temperatures,
				humidities: humidities,
				soilMoistures: soilMoistures,
			};
		} else {
			throw new Error('No data available');
		}
	} catch (error) {
		console.error('Error retrieving sensor data:', error); // Log detailed error
		throw error;
	}
};

/**
 * Method to get the configuration values from the 'relay' node
 * @returns {Promise<Object>} - Returns the config values from Firebase
 * @throws {Error} - Throws an error if data retrieval fails
 */
const getConfigValues = async () => {
	const dbRef = ref(db, 'relay'); // Reference to the 'relay' node

	try {
		const snapshot = await get(dbRef); // Fetch data from Firebase
		if (snapshot.exists()) {
			return snapshot.val(); // Return the data
		} else {
			throw new Error('No data available');
		}
	} catch (error) {
		throw new Error('Error retrieving config values: ' + error.message);
	}
};

/**
 * Function to update autoMode in Firebase
 * @param {number} autoMode - The new autoMode value to be updated
 * @returns {Promise<Object>} - Returns a success message if the update is successful
 * @throws {Error} - Throws an error if the update fails
 */
const updateAutoModeModel = async (autoMode) => {
	try {
		const dbRef = ref(db, 'relay');
		await update(dbRef, { autoMode });
		return { success: true, message: 'autoMode updated successfully' };
	} catch (error) {
		console.error('Error updating autoMode:', error);
		throw new Error('Failed to update autoMode');
	}
};

/**
 * Function to update fan state in Firebase
 * @param {number} fanState - The new fan state to be updated
 * @returns {Promise<Object>} - Returns a success message if the update is successful
 * @throws {Error} - Throws an error if the update fails
 */
const updateFanState = async (fanState) => {
	try {
		const dbRef = ref(db, 'relay');
		await update(dbRef, { fan: fanState });
		return { success: true, message: 'Fan state updated successfully' };
	} catch (error) {
		console.error('Error updating fan state:', error);
		throw new Error('Failed to update fan state');
	}
};

/**
 * Function to update water pump state in Firebase
 * @param {number} waterPumpState - The new water pump state to be updated
 * @returns {Promise<Object>} - Returns a success message if the update is successful
 * @throws {Error} - Throws an error if the update fails
 */
const updateWaterPumpState = async (waterPumpState) => {
	try {
		const dbRef = ref(db, 'relay');
		await update(dbRef, { waterPump: waterPumpState });
		return { success: true, message: 'Water pump state updated successfully' };
	} catch (error) {
		console.error('Error updating water pump state:', error);
		throw new Error('Failed to update water pump state');
	}
};

/**
 * Function to update temperature, humidity, and soil moisture thresholds in Firebase
 * @param {number} temperature - The new temperature threshold to be updated
 * @param {number} humidity - The new humidity threshold to be updated
 * @param {number} soilMoisture - The new soil moisture threshold to be updated
 * @returns {Promise<Object>} - Returns a success message if the update is successful
 * @throws {Error} - Throws an error if the update fails
 */
const updateThresholds = async (temperature, humidity, soilMoisture) => {
	try {
		const dbRef = ref(db, 'relay/');
		await update(dbRef, {
			configTemp: temperature,
			configHumid: humidity,
			configMoisture: soilMoisture,
		});
		return { success: true, message: 'Thresholds updated successfully' };
	} catch (error) {
		console.error('Error updating thresholds:', error);
		throw new Error('Failed to update thresholds');
	}
};

/**
 * Method to authenticate a user by comparing provided credentials with stored admin data in Firebase
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @returns {Promise<Object>} - Returns a success message if authentication is successful
 * @throws {Error} - Throws an error if authentication fails
 */
const authModel = {
	authenticateUser: async (username, password) => {
		try {
			const dbRef = ref(db, 'admin/'); // Reference to the 'admin' node in the database
			const snapshot = await get(dbRef); // Fetch the admin credentials from Firebase

			if (snapshot.exists()) {
				const userData = snapshot.val();
				if (userData.username === username && userData.password === password) {
					return { success: true, message: 'Authentication successful' };
				} else {
					return { success: false, message: 'Invalid username or password' };
				}
			} else {
				return { success: false, message: 'No admin data available' };
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
			return {
				success: false,
				message: 'An error occurred during authentication',
			};
		}
	},
};

module.exports = {
	getSensorValues,
	getLatestSensorData,
	getLatest5SensorData,
	getConfigValues,
	updateAutoModeModel,
	updateFanState,
	updateWaterPumpState,
	updateThresholds,
	authModel,
};
