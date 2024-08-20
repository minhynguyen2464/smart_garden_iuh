const { getSensorValues } = require('../models/gardenModel');

const showSensorData = async (req, res) => {
	try {
		const sensorData = await getSensorValues();
		res.render('index', { sensor: sensorData });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getSensorData = async (req, res) => {
	try {
		const sensorData = await getSensorValues();
		res.json(sensorData); // Send sensor data as JSON
	} catch (error) {
		res.status(500).json({ error: error.message }); // Return error message as JSON
	}
};

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

const getSensorSetting = async (req, res) => {
	try {
		const sensorData = await getSensorValues();
		res.render('setting', { sensor: sensorData });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = {
	showSensorData,
	createSensorData,
	getSensorData,
	getSensorSetting,
};
