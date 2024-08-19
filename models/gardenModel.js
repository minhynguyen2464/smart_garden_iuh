const db = require('../config/firebaseConfig');
const { ref, set, get, child } = require('firebase/database');

// Method to get humidity and temperature from the 'sensors' node
const getSensorValues = async () => {
	const dbRef = ref(db);
	try {
		const snapshot = await get(child(dbRef, 'sensors'));
		if (snapshot.exists()) {
			return snapshot.val();
		} else {
			throw new Error('No data available');
		}
	} catch (error) {
		throw new Error('Error retrieving sensor data: ' + error.message);
	}
};

module.exports = {
	getSensorValues,
};
