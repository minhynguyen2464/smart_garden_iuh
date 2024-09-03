const {
	getLatestSensorData,
	getLatest5SensorData,
	getConfigValues,
	updateAutoModeModel,
	updateWaterPumpState,
	updateFanState,
	updateThresholds,
	authModel,
} = require('../models/gardenModel');

/*
	This is index.ejs file code
*/

// Controller to display the latest sensor data
const showSensorData = async (req, res) => {
	try {
		if (req.session.username === 'admin') {
			const sensorData = await getLatestSensorData();
			// Format the timestamp
			const formattedTimestamp = formatDate(sensorData.timestamp);
			sensorData.timestamp = formattedTimestamp;
			res.render('index', { sensor: sensorData });
		} else {
			res.render('login');
		}
	} catch (error) {
		res.status(500).send(error.message);
	}
};

// Controller to get the latest sensor data in JSON format
const getSensorData = async (req, res) => {
	try {
		const sensorData = await getLatestSensorData();
		const formattedTimestamp = formatDate(sensorData.timestamp);
		sensorData.timestamp = formattedTimestamp;
		res.json(sensorData); // Send sensor data as JSON
	} catch (error) {
		res.status(500).json({ error: error.message }); // Return error message as JSON
	}
};

// Controller to create new sensor data
const createSensorData = async (req, res) => {
	try {
		const { sensorId, moisture, temperature } = req.body;
		const data = { moisture, temperature, timestamp: Date.now() };
		await writeSensorData(sensorId, data);
		res.status(200).json({ message: 'Sensor data saved successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Helper function to format timestamp
const formatDate = (timestamp) => {
	// Split the date and time parts
	const [dateString, timeString] = timestamp.split(' ');

	// Split the date and time components
	const [year, month, day] = dateString.split('-').map(Number);
	const [hour, minute, second] = timeString.split(':').map(Number);

	// Format date and time with leading zeros if necessary
	const dayFormatted = day.toString().padStart(2, '0');
	const monthFormatted = month.toString().padStart(2, '0');
	const yearFormatted = year;
	const hourFormatted = hour.toString().padStart(2, '0');
	const minuteFormatted = minute.toString().padStart(2, '0');
	const secondFormatted = (second || 0).toString().padStart(2, '0');

	// Return formatted date string
	return `${dayFormatted}-${monthFormatted}-${yearFormatted} ${hourFormatted}:${minuteFormatted}:${secondFormatted}`;
};

// Controller to get the latest 5 sensor data points
const get5SensorData = async (req, res) => {
	try {
		const sensorData = await getLatest5SensorData();
		// Send the sensor data as JSON
		res.json(sensorData);
	} catch (error) {
		console.error('Error in get5SensorData:', error); // Log detailed error
		res.status(500).json({ error: error.message }); // Return error message as JSON
	}
};

/*
	This is the settings page controller
*/

// Controller to fetch and render smart garden settings
const getSmartGardenSettings = async (req, res) => {
	try {
		if (req.session.username === 'admin') {
			const configValues = await getConfigValues();

			const {
				configTemp,
				configHumid,
				configMoisture,
				autoMode,
				fan,
				waterPump,
			} = configValues;

			res.render('setting', {
				temperatureThreshold: configTemp,
				humidityThreshold: configHumid,
				soilMoistureThreshold: configMoisture,
				autoMode: autoMode,
				fan: fan,
				waterPump: waterPump,
			});
		} else {
			res.render('login');
		}
	} catch (error) {
		console.error('Error fetching config values from Firebase:', error);
		res.status(500).send('Internal Server Error');
	}
};

// Controller to handle the update of auto mode
const updateAutoMode = async (req, res) => {
	try {
		const { autoMode } = req.body;
		const result = await updateAutoModeModel(autoMode);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Controller to handle updating the fan state
const setFanState = async (req, res) => {
	const { state } = req.body; // Expecting fanState to be sent in the request body

	try {
		const result = await updateFanState(state);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Controller to handle updating the water pump state
const setWaterPumpState = async (req, res) => {
	const { state } = req.body; // Expecting 'state' to be sent in the request body

	try {
		const result = await updateWaterPumpState(state);
		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Controller to save updated threshold values
const saveThresholds = async (req, res) => {
	const { temperatureThreshold, humidityThreshold, soilMoistureThreshold } =
		req.body;

	try {
		const result = await updateThresholds(
			temperatureThreshold,
			humidityThreshold,
			soilMoistureThreshold
		);
		const newValue = {
			temperatureThreshold: temperatureThreshold,
			humidityThreshold: humidityThreshold,
			soilMoistureThreshold: soilMoistureThreshold,
		};
		res.status(200).json(newValue);
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Controller to render the login page
const getLogin = async (req, res) => {
	try {
		res.render('login');
	} catch (error) {
		console.error('Error fetching config values from Firebase:', error);
		res.status(500).send('Internal Server Error');
	}
};

// Authentication controller
const authController = {
	login: async (req, res) => {
		const { username, password } = req.body;

		try {
			const result = await authModel.authenticateUser(username, password);
			if (result.success) {
				// Save the username in the session
				req.session.username = username;

				res.status(200).json({ success: true, message: result.message });
			} else {
				res.status(401).json({ success: false, message: result.message });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ success: false, message: 'Server error' });
		}
	},
};

module.exports = {
	get5SensorData,
	showSensorData,
	createSensorData,
	getSensorData,
	getSmartGardenSettings,
	updateAutoMode,
	setFanState,
	setWaterPumpState,
	saveThresholds,
	getLogin,
	authController,
};
