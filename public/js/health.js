const fileElement = document.getElementById('filename'); // Ensure this is properly escaped
const fileName = fileElement.getHTML();
const fileUrl = document.getElementById('plant-picture').getAttribute('src');
// Extract the filename without the path
const filename = fileName.split('/').pop(); // '5-10-2024-15-40-58.png'
// Remove the .png extension
const strippedFilename = filename.replace('.png', ''); // '5-10-2024-15-40-58'

// Split into components
const [day, month, year, hour, minute, second] = strippedFilename.split('-');

const dayTextBox = document.getElementById('day');
const pictureDay = [day, month, year].join('/');
dayTextBox.innerHTML = pictureDay;

const hourTextBox = document.getElementById('hour');
const hourDay = [hour, minute, second].join(':');
hourTextBox.innerHTML = hourDay;

// Function to format to percentage
function formatToPercentage(value, decimalPlaces = 0) {
	const percentage = (value * 100).toFixed(decimalPlaces);
	return `${percentage}%`;
}

// const adviceText = document.getElementById('advice');

// const adviceMapping = {
// 	'nito-btn': 'Hãy đảm bảo cây được bón đạm thích hợp',
// 	'photpho-btn': 'Hãy sử dụng các loại phân bón giàu phốt pho.',
// 	'kali-btn': 'Hãy bổ sung phân bón có chứa kali vào đất.',
// };

// const healthConfidence = document.getElementById('healthConfidence');
// const formatConfidenceValue = formatToPercentage(healthConfidence.innerHTML);
// healthConfidence.innerHTML = formatConfidenceValue;

// const healthPrediction = document.getElementById('healthResult');
// // List of health issues that should trigger the red color
// const unhealthyConditions = [
// 	'Thiếu hụt Kali -K',
// 	'Thiếu hụt Nito N-',
// 	'Thiếu hụt photpho -P',
// 	'Không nhận diện được',
// ];

// // Check if the innerHTML matches any of the unhealthy conditions
// if (unhealthyConditions.includes(healthPrediction.innerHTML)) {
// 	healthPrediction.style.color = 'red'; // Set text color to red if unhealthy
// } else {
// 	healthPrediction.style.color = 'green'; // Set text color to green if healthy
// }

// const adviceTextBox = document.getElementById('advice');

// List of conditions and their corresponding advice
function lettuceHealthResult(resultClass) {
	const healthPrediction = document.getElementById('healthResult');
	const adviceTextBox = document.getElementById('advice');

	// Map numeric resultClass to readable class names
	const classMapping = {
		2: 'Thiếu hụt Nito N-',
		3: 'Thiếu hụt photpho -P',
		1: 'Thiếu hụt Kali -K',
	};

	const adviceMapping = {
		'Thiếu hụt Nito N-': 'Hãy đảm bảo cây được bón đạm thích hợp.',
		'Thiếu hụt photpho -P': 'Hãy sử dụng các loại phân bón giàu phốt pho.',
		'Thiếu hụt Kali -K': 'Hãy bổ sung phân bón có chứa kali vào đất.',
	};

	// Get the readable class name based on resultClass
	const className = classMapping[resultClass];

	// Check if the prediction is in the bad condition list
	if (adviceMapping[className]) {
		healthPrediction.innerHTML = className;
		adviceTextBox.innerHTML = adviceMapping[className]; // Display the corresponding advice
	} else {
		healthPrediction.innerHTML = 'Khỏe mạnh';
		adviceTextBox.innerHTML =
			'Rau của bạn đang khỏe mạnh! Không cần phải bổ sung gì thêm.'; // Default for good condition
	}

	const unhealthyConditions = [
		'Thiếu hụt Kali -K',
		'Thiếu hụt Nito N-',
		'Thiếu hụt photpho -P',
	];

	if (unhealthyConditions.includes(className)) {
		healthPrediction.style.color = 'red'; // Set text color to red if unhealthy
	} else {
		healthPrediction.style.color = 'green'; // Set text color to green if healthy
	}
}

const uploadButton = document.getElementById('uploadPicture');
const fileInput = document.getElementById('fileInput');

// Event listener for the button click
uploadButton.addEventListener('click', async () => {
	const file = fileInput.files[0];

	if (file) {
		const formData = new FormData();
		formData.append('file', file);

		try {
			// Send file to the server route via axios
			const response = await axios.post('/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			// Output the server response
			console.log('File uploaded successfully:', response.data);
			location.reload();
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	} else {
		alert('Please select a file first!');
	}
});

document
	.getElementById('capturePicture')
	.addEventListener('click', async () => {
		try {
			const response = await axios.post('/camera'); // Trigger the route
			console.log('Camera response:', response.data);
			location.reload();
		} catch (error) {
			console.error('Error capturing picture:', error);
		}
	});

document
	.getElementById('capturePicture')
	.addEventListener('click', function () {
		// Show the notification
		const notificationDiv = document.getElementById('countdownNotification');
		const countdownSpan = document.getElementById('countdown');
		console.log(notificationDiv);
		let countdown = 5; // Starting countdown value

		// Display the notification
		notificationDiv.style.display = 'block';

		// Update the countdown every second
		const interval = setInterval(() => {
			countdown -= 1;
			countdownSpan.textContent = countdown;

			// When countdown reaches 0, stop the interval and hide the notification
			if (countdown === 0) {
				clearInterval(interval);
				countdown = 5;
				notificationDiv.style.display = 'none';
			}
		}, 1000);
	});

const detectNotification = document.getElementById('detectNofitication');
document
	.getElementById('runDetectBtn')
	.addEventListener('click', async (pictureName, pictureUrl) => {
		try {
			pictureName = fileName;
			pictureUrl = fileUrl;
			detectNotification.style.color = 'red';
			let counter = 1;
			detectNotification.innerText = `Đang chạy chuẩn đoán vui lòng đợi... ${counter}s`;

			// Start the timer
			const timer = setInterval(() => {
				counter++;
				detectNotification.innerText = `Đang chạy chuẩn đoán vui lòng đợi... ${counter}s`;
			}, 1000);
			// Get today's date and time
			const res = await axios.post('/postDetection', {
				pictureName,
				pictureUrl,
			});
			if (res.data.success) {
				// Stop the timer
				clearInterval(timer);
				const result = res.data;
				detectNotification.innerText = '';
				document
					.getElementById('plant-picture')
					.setAttribute('src', result.image_url);
				lettuceHealthResult(result.mostFrequentClass);
			} else {
				console.log(res.data);
				alert('Failed ' + res.data.message);
			}
		} catch (err) {
			console.log(err);
			alert('Running detection failed, please check again');
		}
	});
