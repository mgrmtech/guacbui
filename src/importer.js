const puppeteer = require('puppeteer');

const {getConnectionPathMap} = require('./connections.js');
const {convertXlsxToObj} = require('./parser.js');

const {
	createOrUpdateGroupsAndAssignPerms,
	createOrUpdateUsersAndAssignPerms,
	addUsersToGroups,
	deleteUsers,
	deleteGroups
} = require('./bulkops.js');

const login = async (baseURL, username, password) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	try {
		await page.goto(baseURL, {waitUntil: 'networkidle0'});

		await page.type('input[type="text"]', username);
		await page.type('input[type="password"]', password);
		await page.click('input[class="login"]');

		// TODO: Fix the timeout in case of incorrect username/password
		await Promise.race([
			page.waitForNavigation({waitUntil: 'networkidle0'}),
			page.waitForSelector('.recent-connections')
		]);

		const {authToken} = await page.evaluate(
			() => JSON.parse(localStorage.getItem('GUAC_AUTH')) // eslint-disable-line no-undef
		);
		browser.close();
		return authToken;
	} catch (error) {
		console.error('LOGIN ERROR', error);
		browser.close();
	}
};

const importer = async (guacBaseURL, guacUsername, guacPassword, xlsxDataPath) => {
	try {
		const {groups, users, groupUsers} = convertXlsxToObj(xlsxDataPath);
		const authToken = await login(guacBaseURL, guacUsername, guacPassword);

		const connectionPathMap = await getConnectionPathMap(authToken);
		await createOrUpdateGroupsAndAssignPerms(authToken, groups, connectionPathMap);
		await createOrUpdateUsersAndAssignPerms(authToken, users, connectionPathMap);
		await addUsersToGroups(authToken, groupUsers);
	} catch (error) {
		console.error(error);
	}
};

const rollback = async (guacBaseURL, guacUsername, guacPassword, xlsxDataPath) => {
	try {
		const {groups, users} = convertXlsxToObj(xlsxDataPath);
		const authToken = await login(guacBaseURL, guacUsername, guacPassword);

		await deleteUsers(authToken, users);
		await deleteGroups(authToken, groups);
	} catch (error) {
		console.error(error);
	}
};

module.exports = {importer, rollback};
