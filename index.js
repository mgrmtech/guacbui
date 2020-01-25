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
	addUsersToGroup(authToken, groupIdentifier, usernames)
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
		// Assign permissions to groups
		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];

			// Create/Update group
			console.log(`Trying to fetch the user group "${group.identifier}"...`);
			const groupObj = await (await readGroup(authToken, group)).json();
			if (groupObj.type === 'NOT_FOUND') {
				console.log(`Didn't find the user group "${group.identifier}", creating it now...`);
				await createGroup(authToken, group);
				console.log(`Created the user group "${group.identifier}.\n`);
			} else if (groupObj.identifier === group.identifier) {
				console.log(`Found the user group "${group.identifier}", updating it now...`);
				await updateGroup(authToken, group);
				console.log(`Updated the user group "${group.identifier}.\n`);
			}

			// Assign permissions to groups
			const pathValArrForGroupPerms = getPathValArrFromPermObj(group.permissions, connectionPathMap);
			console.log(`Assigning permissions to the group "${group.identifier}"...`);
			await assignPermissionsToGroup(authToken, group.identifier, pathValArrForGroupPerms);
			console.log(`Assigned permissions to the group "${group.identifier}".\n`);
		}

		// Create/Update users
		// Assign permissions to users
		for (let i = 0; i < users.length; i++) {
			const user = users[i];

			// Create/Update user
			console.log(`Trying to fetch the user "${user.username}"...`);
			const userObj = await (await readUser(authToken, user)).json();
			if (userObj.type === 'NOT_FOUND') {
				console.log(`Didn't find the user "${user.username}", creating this user now...`);
				await createUser(authToken, user);
				console.log(`Created the user "${user.username}.\n`);
			} else if (userObj.username === user.username) {
				console.log(`Found the user "${user.username}", updating this user now...`);
				await updateUser(authToken, user);
				console.log(`Updated the user "${user.username}.\n`);
			}

			// Assign permissions to user
			const pathValArrForUserPerms = getPathValArrFromPermObj(user.permissions, connectionPathMap, user.username);
			console.log(`Assigning permissions to the user "${user.username}"...`);
			await assignPermissionsToUser(authToken, user.username, pathValArrForUserPerms);
			console.log(`Assigned permissions to the user "${user.username}".\n`);
		}

		// Add users to their user groups
		const groupIdentifiers = Object.keys(groupUsers);
		for (let i = 0; i < groupIdentifiers.length; i++) {
			groupIdentifier = groupIdentifiers[i];
			console.log(`Adding users to the group "${groupIdentifier}...`);
			await addUsersToGroup(authToken, groupIdentifier, groupUsers[groupIdentifier]);
			console.log(`Added users to the group "${groupIdentifier}.\n`);
		}

		browser.close();
	} catch (runError) {
		console.error(runError);
	}
};

const rollback = async () => {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		// Login, and get the authToken
		await page.goto(GUAC_BASE_URL, { waitUntil: 'networkidle0' });
		const authToken = await login(page);

		const { groups, users } = JSON.parse(fs.readFileSync(DATA_JSON));

		// Delete groups
		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];

			// Delete group
			console.log(`Deleting the user group "${group.identifier}"...`);
			const groupObj = await (await readGroup(authToken, group)).json();
			if (groupObj.type === 'NOT_FOUND') {
				console.log(`Didn't find the user group "${group.identifier}", no further action needed.\n`);
			} else if (groupObj.identifier === group.identifier) {
				console.log(`Found the user group "${group.identifier}", deleting it now...`);
				await deleteGroup(authToken, group);
				console.log(`Deleted the user group "${group.identifier}.\n`);
			}
		}

		// Delete users
		for (let i = 0; i < users.length; i++) {
			const user = users[i];

			// Create/Update user
			console.log(`Trying to fetch the user "${user.username}"...`);
			const userObj = await (await readUser(authToken, user)).json();
			if (userObj.type === 'NOT_FOUND') {
				console.log(`Didn't find the user "${user.username}", no further action needed.\n`);
			} else if (userObj.username === user.username) {
				console.log(`Found the user "${user.username}", deleting this user now...`);
				await deleteUser(authToken, user);
				console.log(`Deleted the user "${user.username}.\n`);
			}
		}

		browser.close();
	} catch (rollbackError) {
		console.error(rollbackError);
	}
};

run();
