const express = require('express');
const {
	showSensorData,
	createSensorData,
	getSensorData,
	getSensorSetting,
} = require('../controllers/gardenController');

const router = express.Router();

router.get('/', showSensorData);
router.get('/sensor', getSensorData);
router.post('/sensor', createSensorData);

router.get('/setting', getSensorSetting);

module.exports = router;
