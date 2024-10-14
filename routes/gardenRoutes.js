const express = require('express');
const multer = require('multer');
const path = require('path');
const { bucket } = require('../config/firebaseConfig'); // Ensure correct path

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
	setCameraState,
	getHistory,
} = require('../controllers/gardenController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

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

//Hepler function to format upload file name
function formatDate() {
	const now = new Date();

	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const year = now.getFullYear();

	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
}

// Define the route to handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
	try {
		const file = req.file;
		if (!file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		// Create a Firebase file reference
		const blob = bucket.file(`photos/${formatDate()}.png`);
		const blobStream = blob.createWriteStream({
			metadata: {
				contentType: file.mimetype,
			},
		});

		blobStream.on('error', (err) => {
			console.error('File upload error:', err);
			return res.status(500).json({ error: 'Error uploading file' });
		});

		blobStream.on('finish', async () => {
			// Get the public URL of the file
			const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
			console.log('File uploaded to Firebase:', publicUrl);
			res
				.status(200)
				.json({ message: 'File uploaded successfully', url: publicUrl });
		});

		// Upload the file
		blobStream.end(file.buffer);
	} catch (error) {
		console.error('Upload error:', error);
		res.status(500).json({ error: 'Failed to upload file' });
	}
});

router.post('/camera', setCameraState);

router.get('/history', getHistory);
module.exports = router;
