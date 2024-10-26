const {
	getLatestSensorData,
	getLatest5SensorData,
	getConfigValues,
	updateAutoModeModel,
	updateWaterPumpState,
	updateFanState,
	updateCameraState,
	updateThresholds,
	authModel,
	getLatestImage,
	getAllSensorData,
} = require('../models/gardenModel');

const nodemailer = require('nodemailer');
const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config();

/**
 * The function `showSensorData` checks if the user is an admin, retrieves the latest sensor data,
 * formats the timestamp, and renders the data on the index page or redirects to the login page.
 * @param req - The `req` parameter in the `showSensorData` function typically represents the request
 * object, which contains information about the HTTP request that triggered the function. This object
 * includes properties such as headers, parameters, query strings, and the request body. It is commonly
 * used to access data sent from the client
 * @param res - The `res` parameter in the `showSensorData` function is typically the response object
 * in Node.js/Express. It is used to send a response back to the client making the request. In this
 * function, `res` is used to render different views based on the conditions checked in the code
 */
const showSensorData = async (req, res) => {
	try {
		if (req.session.username === 'admin') {
			const sensorData = await getLatestSensorData();
			// Format the timestamp
			sensorData.timestamp = formatDate(sensorData.timestamp);
			res.render('index', { sensor: sensorData });
		} else {
			res.render('login');
		}
	} catch (error) {
		res.status(500).send(error.message);
	}
};

/**
 * The function `getSensorData` asynchronously retrieves the latest sensor data, formats the timestamp,
 * and sends the data as JSON, handling errors by returning an error message as JSON with a 500 status
 * code.
 * @param req - The `req` parameter in the `getSensorData` function typically represents the request
 * object, which contains information about the HTTP request that triggered the function. This object
 * includes properties such as headers, parameters, body content, and more, depending on the type of
 * request being made (e.g., GET
 * @param res - The `res` parameter in the `getSensorData` function is the response object that
 * represents the HTTP response that an Express.js route handler sends when it receives an HTTP
 * request. It is used to send data back to the client making the request. In this case, the `res`
 * object is
 */
const getSensorData = async (req, res) => {
	try {
		const sensorData = await getLatestSensorData();
		sensorData.timestamp = formatDate(sensorData.timestamp);

		res.json(sensorData); // Send sensor data as JSON
	} catch (error) {
		res.status(500).json({ error: error.message }); // Return error message as JSON
	}
};

/**
 * The function `createSensorData` saves sensor data with moisture, temperature, and timestamp to a
 * database and returns a success message or an error message.
 * @param req - The `req` parameter in the `createSensorData` function typically represents the HTTP
 * request object, which contains information about the incoming request from the client, such as
 * headers, parameters, body content, and more. In this specific function, `req` is used to extract the
 * sensorId, moisture
 * @param res - The `res` parameter in the `createSensorData` function is the response object that will
 * be used to send a response back to the client making the request. It is typically used to set the
 * HTTP status code and send data back to the client in the form of JSON or other formats.
 */
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

/**
 * The `formatDate` function takes a timestamp string in the format "YYYY-MM-DD HH:MM:SS" and returns a
 * formatted date string in the format "DD-MM-YYYY HH:MM:SS".
 * @param timestamp - The `formatDate` function takes a timestamp as input, which is a string in the
 * format "YYYY-MM-DD HH:MM:SS" representing a date and time. The function then formats this timestamp
 * into a more readable format with leading zeros for single-digit values.
 * @returns The `formatDate` function takes a timestamp as input, splits it into date and time parts,
 * formats the date and time components with leading zeros if necessary, and then returns a formatted
 * date string in the format "DD-MM-YYYY HH:mm:ss".
 */
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

/**
 * The function `get5SensorData` retrieves the latest 5 sensor data entries and sends them as JSON,
 * handling errors by logging detailed errors and returning error messages as JSON.
 * @param req - `req` is the request object representing the HTTP request made to the server. It
 * contains information about the request such as the headers, parameters, body, and more. In this
 * context, `req` is used to receive incoming data from the client making the request.
 * @param res - The `res` parameter in the `get5SensorData` function is the response object that is
 * used to send a response back to the client making the request. In this case, the function is sending
 * the sensor data as JSON using `res.json(sensorData)` when the data is successfully retrieved.
 */
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

/**
 * The function `getSmartGardenSettings` retrieves configuration values for a smart garden system and
 * renders the settings page if the user is an admin, otherwise it renders the login page.
 * @param req - `req` is the request object representing the HTTP request made by the client to the
 * server. It contains information about the request such as the URL, headers, parameters, and session
 * data. In this code snippet, `req.session.username` is used to check if the user is logged in as an
 * @param res - The `res` parameter in the `getSmartGardenSettings` function is the response object
 * that will be sent back to the client making the request. It is used to send a response containing
 * the rendered settings page with the specified configuration values or to render the login page if
 * the user is not authenticated
 */
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

/**
 * The function `updateAutoMode` updates the auto mode using the value from the request body and
 * returns the result as a JSON response.
 * @param req - The `req` parameter in the `updateAutoMode` function typically represents the HTTP
 * request object, which contains information about the incoming request from the client, such as the
 * request headers, parameters, body, and other relevant data. In this specific context, it is being
 * used to extract the `auto
 * @param res - The `res` parameter in the `updateAutoMode` function is the response object that will
 * be used to send a response back to the client making the request. It is typically used to set the
 * status code and send data back in the response.
 */
const updateAutoMode = async (req, res) => {
	try {
		const { autoMode } = req.body;
		const result = await updateAutoModeModel(autoMode);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * The function `setFanState` asynchronously updates the state of a fan based on the request body and
 * sends back the result or an error message.
 * @param req - The `req` parameter in the `setFanState` function typically represents the request
 * object in a Node.js application. It contains information about the incoming HTTP request such as
 * headers, parameters, body, etc. In this specific function, it is expecting a `state` property to be
 * present in the
 * @param res - The `res` parameter in the `setFanState` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to set the
 * status code and send data back in the response.
 */
const setFanState = async (req, res) => {
	const { state } = req.body; // Expecting fanState to be sent in the request body

	try {
		const result = await updateFanState(state);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * The function `setWaterPumpState` asynchronously updates the state of a water pump based on the
 * request body and sends back the result or an error message.
 * @param req - The `req` parameter in the `setWaterPumpState` function typically represents the
 * request object in a Node.js application. It contains information about the HTTP request that
 * triggered the function, including headers, parameters, body content, and more. In this specific
 * function, it is expecting a `state
 * @param res - The `res` parameter in the `setWaterPumpState` function is the response object that
 * will be used to send a response back to the client making the request. It is typically used to set
 * the status code and send data or error messages back to the client.
 */
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

/**
 * The function `saveThresholds` updates temperature, humidity, and soil moisture thresholds based on
 * the request body and returns the new values in a JSON response.
 * @param req - The `req` parameter in the `saveThresholds` function is typically an object
 * representing the HTTP request. It contains information about the request made to the server, such as
 * the request headers, body, parameters, and more. In this specific function, `req.body` is used to
 * extract the
 * @param res - The `res` parameter in the `saveThresholds` function is the response object that will
 * be sent back to the client making the request. It is used to send a response back to the client with
 * the updated threshold values or an error message in case of any issues during the update process.
 */
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

/**
 * The function `getLogin` renders a login page and handles errors by logging them and sending an
 * internal server error response.
 * @param req - The `req` parameter in the `getLogin` function typically represents the request object,
 * which contains information about the HTTP request that is being made. This object includes
 * properties such as the request headers, parameters, body, URL, and more. It is commonly used to
 * access data sent from the client
 * @param res - The `res` parameter in the `getLogin` function is the response object that represents
 * the HTTP response that an Express app sends when it receives an HTTP request. It is used to send a
 * response back to the client making the request. In this case, the `res` object is used to
 */
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
		user: process.env.SENDER_EMAIL_USERNAME, // Replace with your email
		pass: process.env.SENDER_EMAIL_PASSWORD, // Replace with your email password or app password
		// user: 'minhynguyen97@gmail.com', // Replace with your email
		// pass: 'hhli wtvj upau hjlp', // Replace with your email password or app password
	},
});

/**
 * The function `sendEmailAlert` sends email alerts based on different sensor readings and alert
 * statuses.
 * @param temperature - The temperature value in degrees Celsius.
 * @param humidity - Humidity is the amount of water vapor present in the air. It is typically
 * expressed as a percentage and represents the relative humidity level in the environment. High
 * humidity levels can make the air feel damp and uncomfortable, while low humidity levels can lead to
 * dry skin and respiratory issues. Maintaining an optimal humidity
 * @param soilMoisture - Soil moisture level in percentage
 * @param waterLevel - The `waterLevel` parameter in the `sendEmailAlert` function represents the
 * current water level in a specific context, such as a water tank or reservoir. It is used to monitor
 * the amount of water available for irrigation or other purposes in a system. The function sends an
 * email alert based on different
 * @param sendStatus - The `sendStatus` parameter in the `sendEmailAlert` function is used to determine
 * the type of alert email to be sent based on different scenarios. It can have the following values:
 */
const sendEmailAlert = async (
	temperature,
	humidity,
	soilMoisture,
	waterLevel,
	sendStatus
) => {
	let mailOptions = {};
	if (sendStatus === 1) {
		mailOptions = {
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
				<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
				<h3>Chi tiết cảm biết</h3>
				<table style="width: 100%; text-align: left; border-collapse: collapse;">
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Nhiệt độ</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong style="color: #e53935; font-size: 22px;">${temperature}°C</strong></td>
					</tr>
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
	}
	if (sendStatus === 2) {
		mailOptions = {
			from: 'minhynguyen97@gmail.com', // Replace with your email
			to: 'minhynguyen0203@gmail.com', // Replace with recipient email
			subject: 'CẢNH BÁO ĐỘ ẨM ĐẤT!',
			html: `
		<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
			<div style="background-color: #f44336; color: white; padding: 10px 15px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
				<h2>🌱 CẢNH BÁO ĐỘ ẨM ĐẤT!</h2>
			</div>
			<div style="padding: 20px; text-align: center;">
				<p style="font-size: 18px; color: #333;">Độ ẩm đất trong chậu rau quá thấp, cần xử lý!</p>
				<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
				<h3>Chi tiết cảm biết</h3>
				<table style="width: 100%; text-align: left; border-collapse: collapse;">
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Nhiệt độ</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;">${temperature}°C</td>
					</tr>
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Độ ẩm không khí</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;">${humidity}%</td>
					</tr>
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Độ ẩm đất</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong style="color: #e53935; font-size: 22px;">${soilMoisture}%</strong></td>
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
	}
	if (sendStatus === 3) {
		mailOptions = {
			from: 'minhynguyen97@gmail.com', // Replace with your email
			to: 'minhynguyen0203@gmail.com', // Replace with recipient email
			subject: 'CẢNH BÁO ĐỘ MỰC NƯỚC TRONG THÙNG!',
			html: `
		<div style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
			<div style="background-color: #f44336; color: white; padding: 10px 15px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
				<h2>💦 CẢNH BÁO ĐỘ MỰC NƯỚC TRONG THÙNG!</h2>
			</div>
			<div style="padding: 20px; text-align: center;">
				<p style="font-size: 18px; color: #333;">Nước trong thùng tưới sắp hết, xin hãy xử lý!</p>
				<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
				<h3>Chi tiết cảm biết</h3>
				<table style="width: 100%; text-align: left; border-collapse: collapse;">
					<tr>
						<th style="padding: 10px; border-bottom: 1px solid #ddd;">Nhiệt độ</th>
						<td style="padding: 10px; border-bottom: 1px solid #ddd;">${temperature}°C</td>
					</tr>
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
						<td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong style="color: #e53935; font-size: 22px;">${waterLevel}%</strong></td>
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
	}
	try {
		await transporter.sendMail(mailOptions);
		console.log('Caution email sent successfully!');
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

// Controller function to check temperature and send email
/**
 * The function `checkTemperatureAndSendAlert` asynchronously retrieves sensor data, checks for
 * temperature, soil moisture, and water level thresholds, and sends an email alert based on the
 * status.
 */
const checkTemperatureAndSendAlert = async () => {
	try {
		const sensorData = await getLatestSensorData();
		const temperature = sensorData.data.temperature;
		const humidity = sensorData.data.humidity;
		const soilMoisture = sensorData.data.soilMoisture;
		const waterLevel = sensorData.data.waterLevel;
		let sendStatus = 0; //Define 1 for temperature warning, 2 for soil, 3 for water
		console.log('Checking sensor value & send alert... ');
		// Check if temperature exceeds threshold
		if (temperature >= 35) {
			//Temp exceed 35 than send alert
			sendStatus = 1;
		}
		if (soilMoisture <= 40) {
			//Soil moisture lower than 40% than send alert
			sendStatus = 2;
		}
		if (waterLevel <= 10) {
			//Water level lower than 10% then send alert
			sendStatus = 3;
		}
		await sendEmailAlert(
			temperature,
			humidity,
			soilMoisture,
			waterLevel,
			sendStatus
		);
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
		if (/*req.session.username === 'admin'*/ true) {
			let latestImage = await getLatestImage();
			res.render('health', {
				pictures: latestImage.url, //Google Storage url
				filename: latestImage.filename, //8-10-2024-11-04-23
				predictResult: 0,
				predictConfidence: 0, //Dont use
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
// const postPrediction = async (req, res) => {
// 	try {
// 		const { pictureName, pictureUrl } = req.body;
// 		// Fetch the image from the URL
// 		const response = await axios.get(pictureUrl, {
// 			responseType: 'arraybuffer',
// 		});

// 		// Convert the image to a buffer
// 		const imageBuffer = Buffer.from(response.data, 'binary');

// 		// Prepare form-data for the request
// 		const form = new FormData();
// 		form.append('image', imageBuffer, { filename: pictureName }); // Provide a filename
// 		form.append('imageName', pictureName);
// 		// Send POST request to the Python Flask server
// 		const apiResponse = await axios.post(
// 			'http://localhost:5000/predict',
// 			form,
// 			{
// 				headers: form.getHeaders(),
// 			}
// 		);
// 		console.log(apiResponse.data);
// 		// Output the prediction
// 		res.status(200).json({ success: true, message: apiResponse.data });
// 	} catch (error) {
// 		console.error('Error calling Python API:', error);
// 	}
// };

/**
 * The function `postPrediction` sends a POST request to a Python Flask server with image data and
 * returns the prediction result.
 * @param req - The `req` parameter in the `postPrediction` function is the request object representing
 * the HTTP request made to the server. It contains information about the request such as headers,
 * body, parameters, and more. In this case, the function is expecting the request to have a body with
 * `pictureName
 * @param res - The `res` parameter in the `postPrediction` function is the response object that will
 * be sent back to the client making the request. It is used to send a response back to the client with
 * the prediction result obtained from the Python Flask server.
 */
const postPrediction = async (req, res) => {
	try {
		console.log('Prediction is running...');
		const { pictureName, pictureUrl } = req.body;
		// Send POST request to the Python Flask server
		const apiResponse = await axios.post('http://localhost:5000/predict', {
			imageUrl: pictureUrl,
			imageName: pictureName,
		});
		let mostFrequentClass;
		if (apiResponse.data.detections.length != 0) {
			// Step 1: Count occurrences of each class
			const classCounts = apiResponse.data.detections.reduce(
				(acc, detection) => {
					const { class: detectedClass } = detection;
					acc[detectedClass] = (acc[detectedClass] || 0) + 1;
					return acc;
				},
				{}
			);
			// Step 2: Find the class with the highest count
			mostFrequentClass = Object.keys(classCounts).reduce((a, b) =>
				classCounts[a] > classCounts[b] ? a : b
			);
		}
		// Output the prediction
		res.status(200).json({
			success: true,
			image_url: apiResponse.data.image_url,
			mostFrequentClass: mostFrequentClass,
		});
	} catch (error) {
		console.error('Error calling Python API:', error);
	}
};
/*
return
{
  detections: [
    { class: 'Thiếu -N', score: 0.9980423450469971 },
    { class: 'Thiếu -N', score: 0.9979986548423767 },
    { class: 'Thiếu -N', score: 0.9974007606506348 },
    { class: 'Thiếu -N', score: 0.9972037076950073 },
    { class: 'Thiếu -N', score: 0.995796799659729 },
    { class: 'Thiếu -N', score: 0.9950481057167053 },
    { class: 'Thiếu -N', score: 0.9949369430541992 },
    { class: 'Thiếu -N', score: 0.9945588707923889 },
    { class: 'Thiếu -N', score: 0.992865800857544 }
  ],
  image_url: 'https://storage.googleapis.com/project-1-c9d78.appspot.com/detect/26-10-2024-10-22-41.png'
}
*/

/**
 * The function `setCameraState` is an asynchronous function that updates the camera state based on the
 * request body and sends back a response with the result or an error message.
 * @param req - The `req` parameter in the `setCameraState` function typically represents the request
 * object, which contains information about the HTTP request that triggered the function. This object
 * includes properties such as headers, parameters, body, and more, depending on the type of request
 * being made (e.g., GET,
 * @param res - The `res` parameter in the `setCameraState` function is the response object that will
 * be used to send a response back to the client making the request. It is typically used to set the
 * status code and send data back to the client in the form of JSON or other formats.
 */
const setCameraState = async (req, res) => {
	const { state } = req.body; // Expecting 'state' to be sent in the request body

	try {
		const result = await updateCameraState(state);
		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

/**
 * The function `getHistory` asynchronously retrieves all sensor data and renders it in a history view,
 * handling errors by logging them and returning a 500 status with the error message.
 * @param req - The `req` parameter in the `getHistory` function typically represents the HTTP request
 * object, which contains information about the incoming request from the client, such as headers,
 * parameters, and body data. It is commonly used to access data sent by the client to the server.
 * @param res - The `res` parameter in the `getHistory` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to render a view
 * or send data back in a specific format such as JSON.
 */
const getHistory = async (req, res) => {
	try {
		const result = await getAllSensorData();
		res.render('history', { result: result });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
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
	postPrediction,
	setCameraState,
	getHistory,
};
