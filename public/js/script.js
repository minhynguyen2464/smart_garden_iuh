// Dark Mode Toggle
document
	.getElementById('toggleDarkMode')
	.addEventListener('click', function () {
		document.body.classList.toggle('dark-mode');
	});

// Charts
const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
const ctxSoil = document.getElementById('soilMoistureChart').getContext('2d');
const ctxWater = document.getElementById('waterLevelChart').getContext('2d');

//Function này format thời gian cho chart
function formatTime(timestamp) {
	// Extract the time part from the timestamp
	const timePart = timestamp.split(' ')[1]; // "17:18:0"

	// Split the time part into hours, minutes, and seconds
	const [hours, minutes, seconds] = timePart.split(':');

	// Format each part to ensure two digits for minutes and seconds
	const formattedHours = hours.padStart(2, '0');
	const formattedMinutes = minutes.padStart(2, '0');
	const formattedSeconds = (seconds || '0').padStart(2, '0'); // Default to '0' if seconds are missing

	// Construct the formatted time string
	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const temperatureChart = new Chart(ctxTemp, {
	type: 'line',
	data: {
		labels: [], // Will be updated with actual labels
		datasets: [
			{
				label: 'Temperature (°C)',
				data: [], // Will be updated with actual temperatures
				borderColor: 'rgb(255, 99, 132)',
				tension: 0.4,
			},
		],
	},
	options: {
		scales: {
			x: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Time of Day',
				},
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Temperature (°C)',
				},
			},
		},
	},
});

function initTemperatureChart() {
	axios
		.get('/chart')
		.then((response) => {
			const temperatures = response.data;
			for (let i = 0; i < 5; i++) {
				temperatures.timestamps[i] = formatTime(temperatures.timestamps[i]);
			}
			// Update the chart data
			temperatureChart.data.labels = [
				temperatures.timestamps[0],
				temperatures.timestamps[1],
				temperatures.timestamps[2],
				temperatures.timestamps[3],
				temperatures.timestamps[4],
			]; // Set labels with the latest timestamps

			temperatureChart.data.datasets[0].data = [
				temperatures.temperatures[0],
				temperatures.temperatures[1],
				temperatures.temperatures[2],
				temperatures.temperatures[3],
				temperatures.temperatures[4],
			]; // Set temperature data

			// Re-render the chart
			temperatureChart.update();
		})
		.catch((error) => {
			console.error('Error fetching sensor data:', error);
		});
}

const humidityChart = new Chart(ctxHumidity, {
	type: 'line',
	data: {
		labels: [], // Initial labels
		datasets: [
			{
				label: 'Humidity (%)',
				data: [], // Initial data
				borderColor: 'rgb(54, 162, 235)',
				tension: 0.4,
			},
		],
	},
	options: {
		scales: {
			x: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Time of Day',
				},
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Humidity (%)',
				},
			},
		},
	},
});

function initHumidityChart() {
	axios
		.get('/chart')
		.then((response) => {
			const humidities = response.data;
			console.log(humidities);
			for (let i = 0; i < 5; i++) {
				humidities.timestamps[i] = formatTime(humidities.timestamps[i]);
			}
			// Update the chart data
			humidityChart.data.labels = [
				humidities.timestamps[0],
				humidities.timestamps[1],
				humidities.timestamps[2],
				humidities.timestamps[3],
				humidities.timestamps[4],
			]; // Set labels with the latest timestamps

			humidityChart.data.datasets[0].data = [
				humidities.humidities[0],
				humidities.humidities[1],
				humidities.humidities[2],
				humidities.humidities[3],
				humidities.humidities[4],
			]; // Set temperature data

			// Re-render the chart
			humidityChart.update();
		})
		.catch((error) => {
			console.error('Error fetching sensor data:', error);
		});
}

const soilMoistureChart = new Chart(ctxSoil, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: 'Soil Moisture (%)',
				data: [],
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.4,
			},
		],
	},
	options: {},
});

function initSoilMoistureChart() {
	axios
		.get('/chart')
		.then((response) => {
			const soilMoisture = response.data;
			for (let i = 0; i < 5; i++) {
				soilMoisture.timestamps[i] = formatTime(soilMoisture.timestamps[i]);

				soilMoistureChart.data.labels[i] = soilMoisture.timestamps[i];
				soilMoistureChart.data.datasets[0].data[i] =
					soilMoisture.soilMoistures[i];
			}
			// Re-render the chart
			soilMoistureChart.update();
		})
		.catch((error) => {
			console.error('Error fetching sensor data:', error);
		});
}

const waterLevelChart = new Chart(ctxWater, {
	type: 'doughnut',
	data: {
		labels: ['Water Level', 'Empty'],
		datasets: [
			{
				label: 'Water Level (%)',
				data: [75, 25], // Replace with dynamic data
				backgroundColor: ['rgb(54, 162, 235)', 'rgb(235, 235, 235)'],
				hoverOffset: 4,
			},
		],
	},
	options: {
		responsive: true,
		plugins: {
			tooltip: {
				callbacks: {
					label: function (context) {
						return context.label + ': ' + context.raw + '%';
					},
				},
			},
		},
	},
});

function toggleCareMode() {
	const careModeElement = document.getElementById('careMode');
	const currentMode = careModeElement.textContent.trim();

	if (currentMode === 'Automatic') {
		careModeElement.textContent = 'Manual';
	} else {
		careModeElement.textContent = 'Automatic';
	}
}

const formatTimestamp = (timestamp) => {
	// Split the timestamp into date and time parts
	const [datePart, timePart] = timestamp.split(' ');

	// Extract hours and minutes from the time part
	const [hours, minutes] = timePart.split(':');

	// Format the time in HH:MM
	return `${hours}:${minutes}`;
};

/*
// Function to fetch sensor data and update the humidity chart
// Fetch and update chart data every 5 seconds
// Initial fetch to populate the chart immediately
*/
function updateChart() {
	axios
		.get('/sensor')
		.then((response) => {
			const sensorData = response.data;
			// Calculate the empty percentage
			const emptyLevel = 100 - sensorData.data.waterLevel;

			// Update the chart data
			waterLevelChart.data.datasets[0].data = [
				sensorData.data.waterLevel,
				emptyLevel,
			];

			// Add new data point to chart
			humidityChart.data.labels.push(formatTimestamp(sensorData.timestamp));
			humidityChart.data.datasets[0].data.push(sensorData.data.humidity);
			temperatureChart.data.labels.push(formatTimestamp(sensorData.timestamp));
			temperatureChart.data.datasets[0].data.push(sensorData.data.temperature);
			soilMoistureChart.data.labels.push(formatTimestamp(sensorData.timestamp));
			soilMoistureChart.data.datasets[0].data.push(
				sensorData.data.soilMoisture
			);
			// Keep the chart's dataset length consistent (optional)
			if (humidityChart.data.labels.length > 5) {
				humidityChart.data.labels.shift();
				humidityChart.data.datasets[0].data.shift();
			}
			if (temperatureChart.data.labels.length > 5) {
				temperatureChart.data.labels.shift();
				temperatureChart.data.datasets[0].data.shift();
			}
			if (soilMoistureChart.data.labels.length > 5) {
				soilMoistureChart.data.labels.shift();
				soilMoistureChart.data.datasets[0].data.shift();
			}

			// Update the chart
			humidityChart.update();
			temperatureChart.update();
			soilMoistureChart.update();
			// Re-render the chart
			waterLevelChart.update();
		})
		.catch((error) => {
			console.error('Error fetching sensor data:', error);
		});
}

document.addEventListener('DOMContentLoaded', (event) => {
	initTemperatureChart();
	initHumidityChart();
	initSoilMoistureChart();
});

/*
	Function này dùng để gọi data mỗi 20s trên trang index để cập nhật real time
*/
// Function to fetch sensor data and update the dashboard
function fetchSensorData() {
	axios
		.get('/sensor')
		.then((response) => {
			const sensorData = response.data;
			const currentTime = new Date().toLocaleString(); // Get current date and time

			document.getElementById('temperature').textContent =
				sensorData.data.temperature + '°C';
			document.getElementById('humidity').textContent =
				sensorData.data.humidity + '%';
			document.getElementById('waterLevel').textContent =
				sensorData.data.waterLevel + '%';
			document.getElementById('soilMoisture').textContent =
				sensorData.data.soilMoisture + '%';
			document.getElementById('lightLevel').textContent =
				sensorData.data.timeOfDay;

			document.querySelector('#temperature + .sensor-info').textContent =
				sensorData.timestamp;
			document.querySelector('#humidity + .sensor-info').textContent =
				sensorData.timestamp;
			document.querySelector('#waterLevel + .sensor-info').textContent =
				sensorData.timestamp;
			document.querySelector('#soilMoisture + .sensor-info').textContent =
				sensorData.timestamp;
			document.querySelector('#lightLevel + .sensor-info').textContent =
				sensorData.timestamp;
		})
		.catch((error) => {
			console.error('Error fetching sensor data:', error);
		});
}

// Fetch sensor data every 20 seconds
setInterval(fetchSensorData, 20000);

// Fetch and update chart data every 20 seconds
setInterval(updateChart, 20000);
