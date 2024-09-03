document.getElementById('checkAuto').addEventListener('change', function () {
	const manualSettingRow = document.querySelector('.manual-setting');
	if (this.checked) {
		manualSettingRow.style.display = 'none'; // Hide the row when checked
	} else {
		manualSettingRow.style.display = 'flex'; // Show the row when unchecked
	}
});

window.onload = function () {
	const manualSettingRow = document.querySelector('.manual-setting');
	const autoSettingRow = document.querySelector('.auto-setting');
	const checkAuto = document.getElementById('checkAuto');

	// Initial visibility setup
	toggleSettings();

	// Event listener for the checkbox
	checkAuto.addEventListener('change', toggleSettings);

	function toggleSettings() {
		if (checkAuto.checked) {
			manualSettingRow.style.display = 'none';
			autoSettingRow.style.display = 'flex'; // Ensure 'flex' is correct for the layout
		} else {
			manualSettingRow.style.display = 'flex'; // Or 'block' if needed
			autoSettingRow.style.display = 'none';
		}
	}
};

document.addEventListener('DOMContentLoaded', function () {
	// Get the checkbox element
	const checkAuto = document.getElementById('checkAuto');
	// Add event listener to detect changes
	checkAuto.addEventListener('change', function () {
		// Determine the new value for autoMode
		const autoModeValue = this.checked ? 1 : 0;

		// Send the updated value to the server
		axios
			.post('/updateAutoMode', { autoMode: autoModeValue })
			.then((response) => {
				console.log('autoMode updated successfully:', response.data);
			})
			.catch((error) => {
				console.error('Error updating autoMode:', error);
			});
	});
});

/*
	To achieve the functionality where the buttons toggle between "On" and "Off" states, with the 
	corresponding classes btn-success (for "On") and btn-danger (for "Off"), you can use the 
	following JavaScript:
*/
document.addEventListener('DOMContentLoaded', () => {
	// Select the buttons
	const waterBtn = document.getElementById('waterBtn');
	const fanBtn = document.getElementById('fanBtn');

	// // Initialize buttons to "Off" state
	const initializeButton = (button) => {
		if (button.textContent.trim() === 'On') {
			// Use trim() to avoid issues with extra whitespace
			button.classList.remove('btn-danger');
			button.classList.add('btn-success');
		} else {
			button.classList.remove('btn-success');
			button.classList.add('btn-danger');
		}
	};

	// Update Firebase with the new state
	const updateFirebase = async (device, state) => {
		try {
			const url = device === 'waterPump' ? '/water-pump' : '/fan';
			await axios.post(url, {
				state,
			});
		} catch (error) {
			console.error('Error updating Firebase:', error);
		}
	};

	// Toggle function for buttons
	const toggleButtonState = async (button, device) => {
		const isOn = button.textContent === 'On';
		const newState = isOn ? 0 : 1;

		button.classList.toggle('btn-danger', isOn);
		button.classList.toggle('btn-success', !isOn);
		button.textContent = isOn ? 'Off' : 'On';

		// Update Firebase
		await updateFirebase(device, newState);
	};

	// Initialize buttons with their state
	initializeButton(waterBtn);
	initializeButton(fanBtn);

	// Add event listeners to buttons
	waterBtn.addEventListener('click', () =>
		toggleButtonState(waterBtn, 'waterPump')
	);
	fanBtn.addEventListener('click', () => toggleButtonState(fanBtn, 'fan'));
});

document
	.getElementById('settingForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault(); // Prevent the default form submission

		const temperatureThreshold = document.getElementById(
			'temperatureThreshold'
		).value;
		const humidityThreshold =
			document.getElementById('humidityThreshold').value;
		const soilMoistureThreshold = document.getElementById(
			'soilMoistureThreshold'
		).value;

		try {
			const response = await axios.post('/settings/save', {
				temperatureThreshold: parseFloat(temperatureThreshold),
				humidityThreshold: parseFloat(humidityThreshold),
				soilMoistureThreshold: parseFloat(soilMoistureThreshold),
			});
			document.getElementById('tempValue').innerHTML =
				response.data.temperatureThreshold;
			document.getElementById('humidValue').innerHTML =
				response.data.humidityThreshold;
			document.getElementById('soilValue').innerHTML =
				response.data.soilMoistureThreshold;
		} catch (error) {
			console.error('Error saving settings:', error);
			alert('Không thể lưu cài đặt, vui lòng thử lại sau.');
		}
	});
