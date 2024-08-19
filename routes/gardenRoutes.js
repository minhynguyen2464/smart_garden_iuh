const express = require('express');
const {
	showSensorData,
	createSensorData,
	getSensorData,
} = require('../controllers/gardenController');

const router = express.Router();

router.get('/', showSensorData);
router.get('/sensor', getSensorData);
router.post('/sensor', createSensorData);

module.exports = router;
