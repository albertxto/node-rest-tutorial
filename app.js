const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//connect to mongodb
mongoose.connect(
	'mongodb://localhost:27017/node-shop',
	{
		useNewUrlParser: true
	}
);
mongoose.Promise = global.Promise;

app.use(cors()); //prevent cors
app.use(morgan('dev')); //log in development mode
app.use('/uploads', express.static('uploads')); //upload folder available to public
app.use(bodyParser.urlencoded({ extended: false })); //parse urlencoded
app.use(bodyParser.json()); //parse json data

//Set header to prevent CORS
app.use((req, res, next) => {
	res.header('Accept-Control-Allow-Origin', '*');
	res.header(
		'Accept-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if(req.method === 'OPTIONS'){
		res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next(); //handling other request if header not working
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

//Custom 404 not found message
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

//Error Handling
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;