const fileElement = document.getElementById('filename'); // Ensure this is properly escaped
const fileName = fileElement.getHTML();

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

// const healthConfidenceElement = document.getElementById('healthConfidence');
// // Format the confidence value
// const formattedConfidence = formatToPercentage(
// 	healthConfidenceElement.innerHTML
// );
// healthConfidenceElement.innerHTML = formattedConfidence;

const healthPrediction = document.getElementById('healthResult');

// List of health issues that should trigger the red color
const unhealthyConditions = [
	'Thiếu hụt Kali -K',
	'Thiếu hụt Nito N-',
	'Thiếu hụt photpho -P',
];

// Check if the innerHTML matches any of the unhealthy conditions
if (unhealthyConditions.includes(healthPrediction.innerHTML)) {
	healthPrediction.style.color = 'red'; // Set text color to red if unhealthy
} else {
	healthPrediction.style.color = 'green'; // Set text color to green if healthy
}

const adviceTextBox = document.getElementById('advice');

// List of conditions and their corresponding advice
const adviceMapping = {
	'Thiếu hụt Nito N-': 'Hãy đảm bảo cây được bón đạm thích hợp.',
	'Thiếu hụt photpho -P': 'Hãy sử dụng các loại phân bón giàu phốt pho.',
	'Thiếu hụt Kali -K': 'Hãy bổ sung phân bón có chứa kali vào đất.',
};

// Check if the prediction is in the bad condition list
if (adviceMapping[healthPrediction.innerHTML]) {
	adviceTextBox.innerHTML = adviceMapping[healthPrediction.innerHTML]; // Display the corresponding advice
} else {
	adviceTextBox.innerHTML =
		'Your lettuce is in good condition! No action needed.'; // Default for good condition
}
