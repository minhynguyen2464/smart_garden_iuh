const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
	apiKey: 'AIzaSyCnR24elaaAj5ZbvQhOAC36mTRhEsOFn1w',
	authDomain: 'project-1-c9d78.firebaseapp.com',
	databaseURL: 'https://project-1-c9d78-default-rtdb.firebaseio.com',
	projectId: 'project-1-c9d78',
	storageBucket: 'project-1-c9d78.appspot.com',
	messagingSenderId: '543841841890',
	appId: '1:543841841890:web:be0bb0857694ebe1cb64bb',
	measurementId: 'G-B1T1CX0KN6',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = db;
