const {
	getLatestSensorData,
	getLatest5SensorData,
	getConfigValues,
	updateAutoModeModel,
	updateWaterPumpState,
	updateFanState,
	updateThresholds,
	authModel,
	getLatestImage,
} = require('../models/gardenModel');

const nodemailer = require('nodemailer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

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

// Email Configuration
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'minhynguyen97@gmail.com', // Replace with your email
		pass: 'hhli wtvj upau hjlp', // Replace with your email password or app password
	},
});

// Function to send an email alert
const sendEmailAlert = async (
	temperature,
	humidity,
	soilMoisture,
	waterLevel
) => {
	const mailOptions = {
		from: 'minhynguyen97@gmail.com', // Replace with your email
		to: 'minhynguyen0203@gmail.com', // Replace with recipient email
		subject: 'CẢNH BÁO NHIỆT ĐỘ!',
		html: `
		<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
			<div style="background-color: #f44336; color: white; padding: 10px 15px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
				<h2>🔥 CẢNH BÁO NHIỆT ĐỘ!</h2>
			</div>
			<div style="padding: 20px; text-align: center;">
				<p style="font-size: 18px; color: #333;">Nhiệt độ trong vườn đang vượt quá mức cho phép</p>
				<p style="font-size: 16px;">Current temperature: <strong style="color: #e53935; font-size: 22px;">${temperature}°C</strong></p>
				<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
				<h3>Chi tiết cảm biết</h3>
				<table style="width: 100%; text-align: left; border-collapse: collapse;">
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Độ ẩm không khí</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;">${humidity}%</td>
					</tr>
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Độ ẩm đất</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;">${soilMoisture}%</td>
					</tr>
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Mực nước</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;">${waterLevel}%</td>
					</tr>
				</table>
				<p style="font-size: 14px; color: #888; margin-top: 20px;">Hãy chuyển chế độ chăm sóc sang Tự Động hoặc điều khiển Thủ Công!</p>
			</div>
			<div style="background-color: #f7f7f7; padding: 10px 15px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
				<p style="font-size: 12px; color: #777;">Đây là tin nhắn tự động. Không cần hồi âm!</p>
			</div>
		</div>
		`,
	};
	try {
		await transporter.sendMail(mailOptions);
		console.log('Caution email sent successfully!');
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

// Controller function to check temperature and send email
/**
 * The function `checkTemperatureAndSendAlert` asynchronously retrieves the latest sensor data and
 * sends an email alert if the temperature exceeds a threshold.
 */
const checkTemperatureAndSendAlert = async () => {
	try {
		const sensorData = await getLatestSensorData();
		const temperature = sensorData.data.temperature;
		const humidity = sensorData.data.humidity;
		const soilMoisture = sensorData.data.soilMoisture;
		const waterLevel = sensorData.data.waterLevel;
		console.log('Temp now is ' + temperature);
		// Check if temperature exceeds threshold
		if (temperature > 35) {
			await sendEmailAlert(temperature, humidity, soilMoisture, waterLevel);
		}
	} catch (error) {
		console.error('Error in temperature check and alert:', error);
	}
};

/**
 * The function `getPlantHealth` is an asynchronous function that retrieves the latest image, predicts
 * the health of a plant using a machine learning model, and renders the result on a webpage if the
 * user is an admin.
 * @param req - The `req` parameter in the `getPlantHealth` function stands for the request object,
 * which contains information about the HTTP request that triggered the function. This object typically
 * includes details such as the request headers, parameters, body, and session data.
 * @param res - The `res` parameter in the `getPlantHealth` function is the response object that will
 * be used to send a response back to the client making the request. It is typically used to render a
 * view or send data back to the client.
 */
const getPlantHealth = async (req, res) => {
	try {
		if (req.session.username === 'admin') {
			let result = await getLatestImage();
			//let predictResult = await loadModelAndPredict(result.url);
			let predictResult = await loadModelAndPredict(result.url);
			console.log(predictResult.prediction);
			res.render('health', {
				pictures: result.url,
				filename: result.filename,
				predictResult: predictResult.prediction,
				predictConfidence: 0,
			});
		} else {
			res.render('login');
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
};

// Function to call the Python API
/**
 * The function `getPrediction` fetches an image from a URL, converts it to a buffer, sends a POST
 * request to a Python Flask server with the image data, and returns the prediction result.
 * @param imageUrl - The `imageUrl` parameter in the `getPrediction` function is the URL of the image
 * that you want to send to a Python Flask server for prediction. The function fetches the image from
 * this URL, converts it to a buffer, and then sends a POST request to the Python Flask server with the
 * @returns The `getPrediction` function is returning the result of the prediction made by the Python
 * Flask server after processing the image provided in the `imageUrl`. If there is an error during the
 * process, it will log the error message to the console.
 */
const getPrediction = async (imageUrl) => {
	try {
		// Fetch the image from the URL
		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

		// Convert the image to a buffer
		const imageBuffer = Buffer.from(response.data, 'binary');

		// Prepare form-data for the request
		const form = new FormData();
		form.append('image', imageBuffer, { filename: 'image.jpg' }); // Provide a filename

		// Send POST request to the Python Flask server
		const apiResponse = await axios.post(
			'http://localhost:5000/predict',
			form,
			{
				headers: form.getHeaders(),
			}
		);

		// Output the prediction
		const result = apiResponse.data;
		return result;
	} catch (error) {
		console.error('Error calling Python API:', error);
	}
};

/**
 * The function `loadModelAndPredict` asynchronously loads a model and predicts using an image URL
 * provided as input.
 * @param urlPath - The `urlPath` parameter in the `loadModelAndPredict` function is a string that
 * represents the URL path of an image that will be used for prediction.
 * @returns The function `loadModelAndPredict` is returning the result of the prediction made on the
 * image specified by the `urlPath`.
 */
const loadModelAndPredict = async (urlPath) => {
	const imageUrl = urlPath; // Replace with actual image URL
	const result = await getPrediction(imageUrl);
	return result;
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
	checkTemperatureAndSendAlert,
	getPlantHealth,
};
