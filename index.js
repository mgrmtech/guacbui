const fs = require('fs');
const puppeteer = require('puppeteer');

const {
	GUAC_BASE_URL,
	GUAC_USERNAME,
	GUAC_PASSWORD,
	SCREENSHOTS_PATH,
} = require('./src/constants.js');
const { screenshot } = require('./src/utils.js');

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
		// await addUser({
		// 	username: 'RaviVarma',
		// 	password: 'uiop',
		// 	loginDisabled: true,
		// 	passwordExpired: true,
		// 	accessWindowStart: '14:01:00', // HH:MM:SS
		// 	accessWindowEnd: '14:10:25', // HH:MM:SS
		// 	validFrom: '2020-12-01', // YYYY-MM-DD
		// 	validUntil: '2020-12-10', // YYYY-MM-DD
		// 	timezone: 'Asia/Kolkata',
		// 	fullname: 'Uiop Sharma',
		// 	email: 'uiop@uiop.com',
		// 	org: 'AIS',
		// 	orgRole: 'Manager',
		// 	permissions: {
		// 		connections: ['AIS-Employees', 'M-Star SES - AIS', 'Google Chrome-Mdemo'], // TODO: Error check - 'Hoorah'],
		// 		system: [ // TODO: Error check - 'CREATE_HOORAH'
		// 			'ADMINISTER',
		// 			'CREATE_USER',
		// 			'CREATE_USER_GROUP',
		// 			'CREATE_CONNECTION',
		// 			'CREATE_CONNECTION_GROUP',
		// 			'CREATE_SHARING_PROFILE',
		// 		],
		// 		userUpdate: true,
		// 	}
		// }, authToken);

		browser.close();
	} catch (runError) {
		console.error(runError);
	}
};

run();
