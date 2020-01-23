const fs = require('fs');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

const {
	GUAC_BASE_URL,
	GUAC_USERS_URL,
	GUAC_ADD_USER_URL,
	GUAC_USERNAME,
	GUAC_PASSWORD,
	SCREENSHOTS_PATH
} = require('./constants.js');
const { screenshot } = require('./utils.js');

const CONNECTION_API_MAP = {
	'AIS-Employees': '/connectionGroupPermissions/1',
	Hello: '/connectionGroupPermissions/2',
	Hello2: '/connectionGroupPermissions/3',
	HelloConn: '/connectionPermissions/3',
	'M-Star SES - AIS': '/connectionPermissions/1',
	'Google Chrome-Mdemo': '/connectionPermissions/2',
};

const login = async page => {
	try {
		await page.type('input[type="text"]', GUAC_USERNAME);
		await page.type('input[type="password"]', GUAC_PASSWORD);

		await page.click('input[class="login"]');
		await Promise.race([
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
			page.waitForSelector('.recent-connections')
		]);
		await screenshot(page, 'post_login.png');

		const { authToken } = await page.evaluate(() => JSON.parse(localStorage.getItem('GUAC_AUTH')));
		return authToken;
	} catch (loginError) {
		console.error('LOGIN ERROR', loginError);
	}
};

const addUser = async (user, authToken) => {
	try {
		const addUserResponse = await fetch(
			`${GUAC_BASE_URL}/api/session/data/mysql/users?token=${authToken}`,
			{
				credentials: 'omit',
				headers: {
					accept: 'application/json, text/plain, */*',
					'accept-language': 'en-US,en;q=0.9',
					'content-type': 'application/json;charset=UTF-8',
				},
				referrer: `${GUAC_BASE_URL}/`,
				referrerPolicy: 'no-referrer-when-downgrade',
				body: JSON.stringify({
					username: user.username,
					password: user.password,
					attributes: {
						disabled: user.loginDisabled,
						expired: user.passwordExpired,
						timezone: user.timezone, // 'Asia/Kolkata'
						'access-window-start': user.accessWindowStart, // HH:MM:SS
						'access-window-end': user.accessWindowEnd, // HH:MM:SS
						'valid-from': user.validFrom, // YYYY-MM-DD
						'valid-until': user.validUntil, // YYYY-MM-DD
						'guac-full-name': user.fullname,
						'guac-email-address': user.email,
						'guac-organization': user.org,
						'guac-organizational-role': user.orgRole,
					},
				}),
				method: 'POST',
				mode: 'cors',
		});
		const addUserResult = await addUserResponse.json();
		console.log({ addUserResult });


		console.log({ perm: [
			// { op: 'add', path: '/connectionPermissions/2', value: 'READ' },
			// { op: 'add', path: '/connectionPermissions/2', value: 'READ' },
			// { op: 'add', path: '/connectionGroupPermissions/1', value: 'READ' },
			...(
				user.permissions && user.permissions.connections
					? user.permissions.connections.map(conn =>
						({
							op: 'add',
							path: CONNECTION_API_MAP[conn],
							value: 'READ'
						})
					)
					: []
			),
			// { op: 'add', path: '/systemPermissions', value: 'ADMINISTER' },
			// { op: 'add', path: '/systemPermissions', value: 'CREATE_USER' },
			// { op: 'add', path: '/systemPermissions', value: 'CREATE_USER_GROUP' },
			// { op: 'add', path: '/systemPermissions', value: 'CREATE_CONNECTION' },
			// { op: 'add', path: '/systemPermissions', value: 'CREATE_CONNECTION_GROUP' },
			// { op: 'add', path: '/systemPermissions', value: 'CREATE_SHARING_PROFILE' },
			...(
				user.permissions && user.permissions.system
					? user.permissions.system.map(sysPerm =>
						({
							op: 'add',
							path: '/systemPermissions',
							value: sysPerm,
						})
					)
					: []
			),
			...(
				user.permissions && user.permissions.userUpdate
					? [{ op: 'add', path: `/userPermissions/${user.username}`, value: 'UPDATE' }]
					: []
			),
		]});
		const patchUserPermResponse = await fetch(
			`${GUAC_BASE_URL}/api/session/data/mysql/users/${user.username}/permissions?token=${authToken}`,
			{
				credentials: 'omit',
				headers: {
					accept: 'application/json, text/plain, */*',
					'accept-language': 'en-US,en;q=0.9',
					'content-type': 'application/json',
				},
				referrer: `${GUAC_BASE_URL}/`,
				referrerPolicy: 'no-referrer-when-downgrade',
				/*
				permissions:
					changeOwnPassword
					administerSystem
					createNewUsers
					createNewUserGroups
					createNewConnections
					createNewConnectionGroups
					createNewSharingProfiles
					connections: []
				*/
				body: JSON.stringify([
					// { op: 'add', path: '/connectionPermissions/2', value: 'READ' },
					// { op: 'add', path: '/connectionPermissions/2', value: 'READ' },
					// { op: 'add', path: '/connectionGroupPermissions/1', value: 'READ' },
					...(
						user.permissions && user.permissions.connections
							? user.permissions.connections.map(conn =>
								({
									op: 'add',
									path: CONNECTION_API_MAP[conn],
									value: 'READ'
								})
							)
							: []
					),
					// { op: 'add', path: '/systemPermissions', value: 'ADMINISTER' },
					// { op: 'add', path: '/systemPermissions', value: 'CREATE_USER' },
					// { op: 'add', path: '/systemPermissions', value: 'CREATE_USER_GROUP' },
					// { op: 'add', path: '/systemPermissions', value: 'CREATE_CONNECTION' },
					// { op: 'add', path: '/systemPermissions', value: 'CREATE_CONNECTION_GROUP' },
					// { op: 'add', path: '/systemPermissions', value: 'CREATE_SHARING_PROFILE' },
					...(
						user.permissions && user.permissions.system
							? user.permissions.system.map(sysPerm =>
								({
									op: 'add',
									path: '/systemPermissions',
									value: sysPerm,
								})
							)
							: []
					),
					...(
						user.permissions && user.permissions.userUpdate
							? [{ op: 'add', path: `/userPermissions/${user.username}`, value: 'UPDATE' }]
							: []
					),
				]),
				method: 'PATCH',
				'mode': 'cors'
			}
		);
		// const patchUserPermResult = await patchUserPermResponse.json();
		console.log({ patchUserPermResponse });
	} catch (addUserError) {
		console.error('ADD USER ERROR', addUserError);
	}
};

const run = async () => {
	if (!fs.existsSync(SCREENSHOTS_PATH)) {
		fs.mkdirSync(SCREENSHOTS_PATH);
	}

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(GUAC_BASE_URL, { waitUntil: 'networkidle0' });

		const authToken = await login(page);
		console.log({ authToken });
		await addUser({
			username: 'RaviVarma',
			password: 'uiop',
			loginDisabled: true,
			passwordExpired: true,
			accessWindowStart: '14:01:00', // HH:MM:SS
			accessWindowEnd: '14:10:25', // HH:MM:SS
			validFrom: '2020-12-01', // YYYY-MM-DD
			validUntil: '2020-12-10', // YYYY-MM-DD
			timezone: 'Asia/Kolkata',
			fullname: 'Uiop Sharma',
			email: 'uiop@uiop.com',
			org: 'AIS',
			orgRole: 'Manager',
			permissions: {
				connections: ['AIS-Employees', 'M-Star SES - AIS', 'Google Chrome-Mdemo'], // TODO: Error check - 'Hoorah'],
				system: [ // TODO: Error check - 'CREATE_HOORAH'
					'ADMINISTER',
					'CREATE_USER',
					'CREATE_USER_GROUP',
					'CREATE_CONNECTION',
					'CREATE_CONNECTION_GROUP',
					'CREATE_SHARING_PROFILE',
				],
				userUpdate: true,
			}
		}, authToken);

		browser.close();
	} catch (runError) {
		console.error(runError);
	}
};

run();
