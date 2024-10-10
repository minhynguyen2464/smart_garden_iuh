const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
var admin = require('firebase-admin');
var serviceAccount = require('./project-1-c9d78-firebase-adminsdk-ffghd-b23fe2650c.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.DATABASE_URL,
	storageBucket: 'gs://project-1-c9d78.appspot.com',
});

const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: 'project-1-c9d78.firebaseapp.com',
	databaseURL: process.env.DATABASE_URL,
	projectId: 'project-1-c9d78',
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: '543841841890',
	appId: '1:543841841890:web:be0bb0857694ebe1cb64bb',
	measurementId: 'G-B1T1CX0KN6',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = admin.storage();
const bucket = admin.storage().bucket();

module.exports = { db, storage, bucket };
