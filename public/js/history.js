// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
const searchInput = document.getElementById('searchInput');
const tableBody = document.getElementById('dataTableBody');

// Set the default value of the input to today's date
document.getElementById('searchInput').value = today;
const filter = searchInput.value; // In YYYY-MM-DD format
const rows = tableBody.getElementsByTagName('tr');

for (let i = 0; i < rows.length; i++) {
	const dateTimeCell = rows[i].getElementsByTagName('td')[4]; // 5th column (Date & Time)
	if (dateTimeCell) {
		const dateTimeValue = dateTimeCell.textContent || dateTimeCell.innerText;
		const dateOnly = dateTimeValue.split(' ')[0]; // Extract the date part (YYYY-MM-DD)

		if (dateOnly === filter) {
			rows[i].style.display = ''; // Show the row if it matches
		} else {
			rows[i].style.display = 'none'; // Hide the row if it doesn't match
		}
	}
}

// Existing filtering logic
searchInput.addEventListener('input', function () {
	const filter = searchInput.value; // In YYYY-MM-DD format
	const rows = tableBody.getElementsByTagName('tr');

	for (let i = 0; i < rows.length; i++) {
		const dateTimeCell = rows[i].getElementsByTagName('td')[4]; // 5th column (Date & Time)
		if (dateTimeCell) {
			const dateTimeValue = dateTimeCell.textContent || dateTimeCell.innerText;
			const dateOnly = dateTimeValue.split(' ')[0]; // Extract the date part (YYYY-MM-DD)

			if (dateOnly === filter) {
				rows[i].style.display = ''; // Show the row if it matches
			} else {
				rows[i].style.display = 'none'; // Hide the row if it doesn't match
			}
		}
	}
});
