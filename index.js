const fs = require('fs');
const puppeteer = require('puppeteer');

const {
	GUAC_BASE_URL,
	GUAC_USERS_URL,
	GUAC_ADD_USER_URL,
	GUAC_USERNAME,
	GUAC_PASSWORD,
	SCREENSHOTS_PATH,
} = require('./constants.js');
const { screenshot } = require('./utils.js')


const run = async () => {
	if (!fs.existsSync(SCREENSHOTS_PATH)) {
		fs.mkdirSync(SCREENSHOTS_PATH);
	}

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(GUAC_BASE_URL, { waitUntil: 'networkidle0' });
		await page.type('input[type="text"]', GUAC_USERNAME);
		await page.type('input[type="password"]', GUAC_PASSWORD);
		await screenshot(page, 'login.png');

		await page.click('input[class="login"]');
		await Promise.race([
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
			page.waitForSelector('.recent-connections'),
		]);
		
		await page.goto(GUAC_USERS_URL, { waitUntil: 'networkidle0' });
		await page.waitForSelector('.toolbar');
		await screenshot(page, 'users.png');

		await page.goto(GUAC_ADD_USER_URL, { waitUntil: 'networkidle0' });
		await page.waitForSelector('.properties');
		await screenshot(page, 'add_user.png');

		browser.close();
	} catch (error) {
		console.error(error);
	}
}

run();