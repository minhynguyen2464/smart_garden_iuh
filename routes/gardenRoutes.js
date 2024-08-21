const express = require('express');
const {
	showSensorData,
	createSensorData,
	getSensorData,
	getSensorSetting,
	get5SensorData,
} = require('../controllers/gardenController');

const router = express.Router();

router.get('/', showSensorData);
router.get('/sensor', getSensorData);
router.get('/chart', get5SensorData);
router.post('/sensor', createSensorData);

router.get('/setting', getSensorSetting);

module.exports = router;
