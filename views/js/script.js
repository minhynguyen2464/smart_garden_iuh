// Sample Data for Testing (replace with real-time data from your backend)
document.getElementById('soilMoisture').innerText = '45%';
document.getElementById('temperature').innerText = '24°C';
document.getElementById('humidity').innerText = '60%';
document.getElementById('lightLevel').innerText = 'Day';
document.getElementById('waterLevel').innerText = '75%'; // Water Level

// Dark Mode Toggle
document
	.getElementById('toggleDarkMode')
	.addEventListener('click', function () {
		document.body.classList.toggle('dark-mode');
	});

// Charts
const ctxTemp = document.getElementById('temperatureChart').getContext('2d');
const ctxHum = document.getElementById('humidityChart').getContext('2d');
const ctxSoil = document.getElementById('soilMoistureChart').getContext('2d');
const ctxLight = document.getElementById('lightLevelChart').getContext('2d');

const temperatureChart = new Chart(ctxTemp, {
	type: 'line',
	data: {
		labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
		datasets: [
			{
				label: 'Temperature (°C)',
				data: [18, 20, 24, 22, 19],
				borderColor: 'rgb(255, 99, 132)',
				tension: 0.4,
			},
		],
	},
	options: {},
});

const humidityChart = new Chart(ctxHum, {
	type: 'line',
	data: {
		labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
		datasets: [
			{
				label: 'Humidity (%)',
				data: [85, 80, 75, 70, 65],
				borderColor: 'rgb(54, 162, 235)',
				tension: 0.4,
			},
		],
	},
	options: {},
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

const lightLevelChart = new Chart(ctxLight, {
	type: 'line',
	data: {
		labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
		datasets: [
			{
				label: 'Light Level (lx)',
				data: [800, 1200, 1500, 1400, 1000],
				borderColor: 'rgb(255, 205, 86)',
				tension: 0.4,
			},
		],
	},
	options: {},
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
