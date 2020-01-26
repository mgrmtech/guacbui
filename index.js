const {importer} = require('./src/importer.js');
const config = require('./config.js');

importer(
	config.guacBaseURL,
	config.guacUsername,
	config.guacPassword,
	config.xlsxDataPath
);
