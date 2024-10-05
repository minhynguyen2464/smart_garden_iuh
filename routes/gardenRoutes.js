const express = require('express');
const {
	showSensorData,
	createSensorData,
	getSensorData,
	get5SensorData,
	getSmartGardenSettings,
	updateAutoMode,
	setFanState,
	setWaterPumpState,
	saveThresholds,
	getLogin,
	getPlantHealth,
	authController,
} = require('../controllers/gardenController');

const router = express.Router();

router.get('/', showSensorData);
router.get('/sensor', getSensorData);
router.get('/chart', get5SensorData);
router.post('/sensor', createSensorData);

router.get('/setting', getSmartGardenSettings);
router.post('/updateAutoMode', updateAutoMode);
// Route to update the fan state
router.post('/fan', setFanState);
// Route to update the water pump state
router.post('/water-pump', setWaterPumpState);
router.post('/settings/save', saveThresholds);

router.get('/login', getLogin);
router.post('/login', authController.login);

router.get('/health', getPlantHealth);
module.exports = router;
