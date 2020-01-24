const fs = require('fs');
const puppeteer = require('puppeteer');

const {
	GUAC_BASE_URL,
	GUAC_USERNAME,
	GUAC_PASSWORD,
	DATA_JSON,
	SCREENSHOTS_PATH,
} = require('./src/constants.js');
const { screenshot } = require('./src/utils.js');
const { fetchConnectionTree, getConnectionPathMap } = require('./src/connections.js');
const { assignPermissionsToUser, assignPermissionsToGroup, getPathValArrFromPermObj } = require('./src/permissions.js');

const {
	createGroup,
	readGroup,
	updateGroup,
	deleteGroup,
	createUser,
	readUser,
	updateUser,
	deleteUser,
	addUsersToGroup,
} = require('./src/crud.js');

const login = async page => {
	try {
		await page.type('input[type="text"]', GUAC_USERNAME);
		await page.type('input[type="password"]', GUAC_PASSWORD);

		await page.click('input[class="login"]');
		await Promise.race([
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
			page.waitForSelector('.recent-connections')
		]);
		// await screenshot(page, 'post_login.png');

		const { authToken } = await page.evaluate(() => JSON.parse(localStorage.getItem('GUAC_AUTH')));
		return authToken;
	} catch (loginError) {
		console.error('LOGIN ERROR', loginError);
	}
};

/*
FLOW

0. Login, and get the authToken
1. Get connection -> path map
	connPathMap
2. Create groups
3. Assign permissions to groups
	getPathValArrFromPermObj(group.permissions, connPathMap)
	assignPermissionsToGroup(authToken, group.identifier, permissions)
3. Create users
4. Assign permissions to users
	getPathValArrFromPermObj(user.permissions, connPathMap, username)
	assignPermissionsToGroup(authToken, user.username, permissions)
5. Add users to their user groups
	addUsersToGroup(authToken, aKeyFromTheAboveObj, correspondingValue)
*/
const run = async () => {
	if (!fs.existsSync(SCREENSHOTS_PATH)) {
		fs.mkdirSync(SCREENSHOTS_PATH);
	}

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		// Login, and get the authToken
		await page.goto(GUAC_BASE_URL, { waitUntil: 'networkidle0' });
		const authToken = await login(page);

		// Get connection -> path map
		const connectionTree = await (await fetchConnectionTree(authToken)).json();
		const connectionPathMap = getConnectionPathMap(connectionTree);
		
		const { groups, users, groupUsers } = JSON.parse(fs.readFileSync(DATA_JSON));
		// Create/Update groups
		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];
			console.log(`Trying to fetch the user group "${group.identifier}"...`);
			const groupObj = await (await readGroup(authToken, group)).json();
			if (groupObj.type === 'NOT_FOUND') {
				console.log(`Didn't find the user group "${group.identifier}", creating it now...`);
				await createGroup(authToken, group);
				console.log(`Created the user group "${group.identifier}.\n`)
			} else if (groupObj.identifier === group.identifier) {
				console.log(`Found the user group "${group.identifier}", updating it now...`);
				await updateGroup(authToken, group);
				console.log(`Updated the user group "${group.identifier}.\n`)
			}

			// Assign permissions to groups
			const pathValArrForGroupPerms = getPathValArrFromPermObj(group.permissions, connectionPathMap);
			console.log({ pathValArrForGroupPerms });
			console.log(`Assigning permissions to the group "${group.identifier}"...`);
			await assignPermissionsToGroup(authToken, group.identifier, pathValArrForGroupPerms);
			console.log(`Assigned permissions to the group "${group.identifier}"...`);
		}

		

		browser.close();
	} catch (runError) {
		console.error(runError);
	}
};

run();
