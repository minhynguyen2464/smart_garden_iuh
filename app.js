const express = require('express');
const bodyParser = require('body-parser');
const gardenRoutes = require('./routes/gardenRoutes');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
// Setup session middleware
app.use(
	session({
		secret: '123qwe!@#', // Replace with your own secret key
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }, // Set `secure: true` if using HTTPS
	})
);

app.use('/', gardenRoutes);

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
