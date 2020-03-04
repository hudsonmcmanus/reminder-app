const config = require('./config.json');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const logSymbols = require('log-symbols');
const { mongoose } = require('./database');

const jwt = require('./jwt');

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
	jwt({
		secret: config.jwtSecret,
		expireIn: 60 * 60 * 24 * 7
	})
);

app.use('/', require('./router'));

(async () => {
	console.log('Starting...');

	try {
		await mongoose.connect(config.mongoURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
		console.log(logSymbols.success, 'MongoDB connected');
	} catch (err) {
		console.log(logSymbols.error, `MongoDB connection failed: ${err.message}`);
		return;
	}

	app.listen(config.port, () => {
		console.log(logSymbols.success, `HTTP listening on port ${config.port}`);
	});
})();
