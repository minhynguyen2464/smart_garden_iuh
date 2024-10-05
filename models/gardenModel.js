const { db } = require('../config/firebaseConfig');
const { storage } = require('../config/firebaseConfig'); // Ensure correct path

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
 * The function `getLatest5SensorData` retrieves the latest 5 sensor data records from a Firebase
 * Realtime Database and organizes them into separate arrays based on temperature, humidity, soil
 * moisture, and timestamps.
 * @returns The `getLatest5SensorData` function returns an object containing arrays of the latest 5
 * sensor data values for temperatures, humidities, soil moistures, and timestamps.
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
 * The function `getConfigValues` retrieves configuration values from a Firebase database under the
 * 'relay' node.
 * @returns The `getConfigValues` function returns the data fetched from the 'relay' node in Firebase
 * if it exists. If no data is available, it throws an error with the message 'No data available'. If
 * there is an error during the retrieval process, it throws an error with the message 'Error
 * retrieving config values' followed by the specific error message.
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

/**
 * Function to get the latest image from Firebase Storage
 * Assumes filenames follow the format 'day-month-year-hour-minute-second.png'
 * @returns {Promise<string>} - The public URL of the latest image
 * @throws {Error} - Throws an error if image retrieval fails
 */
const getLatestImage = async () => {
	const bucket = storage.bucket();
	const folder = 'photos'; // Folder where images are stored

	try {
		// List all files in the 'photos' folder
		const [files] = await bucket.getFiles({ prefix: folder });

		if (files.length === 0) {
			throw new Error('No images found in Firebase Storage');
		}

		const sortedFiles = files
			.map((file) => file.name)
			.filter((name) => name.endsWith('.png')) // Only consider PNG files
			.sort((a, b) => {
				// Extract parts from filename (DD-MM-YY-HH-mm-ss)
				const [dayA, monthA, yearA, hourA, minuteA, secondA] = a
					.replace('.png', '')
					.split('-')
					.map(Number);

				const [dayB, monthB, yearB, hourB, minuteB, secondB] = b
					.replace('.png', '')
					.split('-')
					.map(Number);

				// Create date objects from parts
				const dateA = new Date(
					2000 + yearA, // Adjust for YY (assuming all years are in 2000+)
					monthA - 1, // Months are 0-indexed in JS Date
					dayA,
					hourA,
					minuteA,
					secondA
				);

				const dateB = new Date(
					2000 + yearB,
					monthB - 1,
					dayB,
					hourB,
					minuteB,
					secondB
				);

				// Sort in descending order (latest first)
				return dateB - dateA;
			});
		// Get the latest image file name
		const lastestImageIndex = sortedFiles.length - 1;
		const latestFileName = sortedFiles[lastestImageIndex];
		// Generate a signed URL for accessing the image
		const [url] = await bucket.file(latestFileName).getSignedUrl({
			action: 'read',
			expires: '03-01-2500', // Set a far future expiration date
		});
		const result = {
			url: url,
			filename: latestFileName,
		};
		return result; // Return the public URL of the latest image
	} catch (error) {
		console.error('Error retrieving the latest image:', error);
		throw new Error('Failed to retrieve the latest image');
	}
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
	getLatestImage,
	authModel,
};
