const express = require('express');
const bodyParser = require('body-parser');
const gardenRoutes = require('./routes/gardenRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());

app.use('/', gardenRoutes);

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
