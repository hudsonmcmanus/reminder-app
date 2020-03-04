const config = require('./config.json');

const express = require('express');
const morgan = require('morgan');
const logSymbols = require('log-symbols');
const { mongoose } = require('./database');

const app = express();
app.use(morgan('dev'));

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
