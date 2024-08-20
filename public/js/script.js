// Sample Data for Testing (replace with real-time data from your backend)
// document.getElementById('soilMoisture').innerText = '45%';
// document.getElementById('temperature').innerText = '24°C';
// document.getElementById('humidity').innerText = '60%';
// document.getElementById('lightLevel').innerText = 'Day';
// document.getElementById('waterLevel').innerText = '75%'; // Water Level

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
// const ctxLight = document.getElementById('lightLevelChart').getContext('2d');
const ctxWater = document.getElementById('waterLevelChart').getContext('2d');

const temperatureChart = new Chart(ctxTemp, {
	type: 'line',
	data: {
		labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
		datasets: [
			{
				label: 'Temperature (°C)',
				data: [18, 20, 24, 22, 19], // Initial data
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

const humidityChart = new Chart(ctxHumidity, {
	type: 'line',
	data: {
		labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'], // Initial labels
		datasets: [
			{
				label: 'Humidity (%)',
				data: [60, 62, 65, 64, 61], // Initial data
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

const soilMoistureChart = new Chart(ctxSoil, {
	type: 'line',
	data: {
		labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
		datasets: [
			{
				label: 'Soil Moisture (%)',
				data: [40, 45, 50, 48, 42],
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.4,
			},
		],
	},
	options: {},
});

// const lightLevelChart = new Chart(ctxLight, {
// 	type: 'line',
// 	data: {
// 		labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
// 		datasets: [
// 			{
// 				label: 'Light Level (lx)',
// 				data: [800, 1200, 1500, 1400, 1000],
// 				borderColor: 'rgb(255, 205, 86)',
// 				tension: 0.4,
// 			},
// 		],
// 	},
// 	options: {},
// });

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
/*
// Function to fetch sensor data and update the chart
// Fetch and update chart data every 20 seconds
// Initial fetch to populate the chart immediately
*/
function updateTemperatureChart() {
	axios
		.get('/sensor')
		.then((response) => {
			const sensorData = response.data;
			const currentTime = new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}); // Get current time

			// Add new data point to chart
			temperatureChart.data.labels.push(currentTime);
			temperatureChart.data.datasets[0].data.push(sensorData.temperature);

			// Keep the chart's dataset length consistent (optional)
			if (temperatureChart.data.labels.length > 10) {
				temperatureChart.data.labels.shift();
				temperatureChart.data.datasets[0].data.shift();
			}

			// Update the chart
			temperatureChart.update();
		})
		.catch((error) => {
			console.error('Error fetching sensor data:', error);
		});
}

// Fetch and update chart data every 20 seconds
setInterval(updateTemperatureChart, 20000);
// Initial fetch to populate the chart immediately
updateTemperatureChart();

/*
// Function to fetch sensor data and update the humidity chart
// Fetch and update chart data every 5 seconds
// Initial fetch to populate the chart immediately
*/
function updateHumidityChart() {
	axios
		.get('/sensor')
		.then((response) => {
			const sensorData = response.data;
			const currentTime = new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}); // Get current time

			// Add new data point to chart
			humidityChart.data.labels.push(currentTime);
			humidityChart.data.datasets[0].data.push(sensorData.humidity);

			// Keep the chart's dataset length consistent (optional)
			if (humidityChart.data.labels.length > 10) {
				humidityChart.data.labels.shift();
				humidityChart.data.datasets[0].data.shift();
			}

			// Update the chart
			humidityChart.update();
		})
		.catch((error) => {
			console.error('Error fetching sensor data:', error);
		});
}

// Fetch and update chart data every 5 seconds
setInterval(updateHumidityChart, 20000);

// Initial fetch to populate the chart immediately
updateHumidityChart();
