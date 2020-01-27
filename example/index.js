const {getAuthToken} = require('./login.js');
const {baseURL, username, password, authToken, xlsxPath} = require('./config.js');
const {importer, rollback, convertXlsxToObj} = require('..');

const run = async (options = {rollback: false}) => {
	let authTokenForThisRun = authToken;
	if (!authTokenForThisRun) {
		authTokenForThisRun = await getAuthToken(baseURL, username, password);
	}

	const runOp = options.rollback ? rollback : importer;
	const data = convertXlsxToObj(xlsxPath);

	runOp(baseURL, authTokenForThisRun, data);
};

run({rollback: false});
