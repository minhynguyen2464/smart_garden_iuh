const db = require('../config/firebaseConfig');
const {
	ref,
	get,
	query,
	orderByKey,
	limitToLast,
	child,
} = require('firebase/database'); // Ensure correct imports

// Method to get humidity and temperature from the 'sensors' node
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
			// Return the latest data
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

module.exports = {
	getSensorValues,
	getLatestSensorData,
	getLatest5SensorData,
};
