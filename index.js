const fs = require("fs");
const puppeteer = require("puppeteer");

const {
	GUAC_BASE_URL,
	GUAC_USERS_URL,
	GUAC_ADD_USER_URL,
	GUAC_USERNAME,
	GUAC_PASSWORD,
	SCREENSHOTS_PATH
} = require("./constants.js");
const { screenshot } = require("./utils.js");

const login = async page => {
	try {
		await page.type('input[type="text"]', GUAC_USERNAME);
		await page.type('input[type="password"]', GUAC_PASSWORD);

		await page.click('input[class="login"]');
		await Promise.race([
			page.waitForNavigation({ waitUntil: "networkidle0" }),
			page.waitForSelector(".recent-connections")
		]);
		await screenshot(page, "post_login.png");

		const { authToken } = await page.evaluate(() => JSON.parse(localStorage.getItem('GUAC_AUTH')));
		return authToken;
	} catch (loginError) {
		console.error("LOGIN ERROR", loginError);
	}
};

const addUser = async user => {
	try {
		fetch(
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
					username: '0501999988959144',
					password: '123',
					attributes: {
						disabled: '',
						expired: '',
						'access-window-start': '',
						'access-window-end': '',
						'valid-from': '',
						'valid-until': '',
						timezone: null,
						'guac-full-name': 'hello',
					},
				}),
				method: 'POST',
				mode: 'cors',
		});
	} catch (addUserError) {
		console.error("ADD USER ERROR", addUserError);
	}
};

const run = async () => {
	if (!fs.existsSync(SCREENSHOTS_PATH)) {
		fs.mkdirSync(SCREENSHOTS_PATH);
	}

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(GUAC_BASE_URL, { waitUntil: "networkidle0" });

		const authToken = await login(page);
		console.log({ authToken });
		await addUser(page, {
			username: "4801999993019144",
			password: "M0N91A01",
			fullname: "AJAY PANDEY",
			usergroup: "E",
			organization: "AIS",
			connections: ["Google Chrome-Mdemo", "M-Star SES - AIS"]
		});

		browser.close();
	} catch (runError) {
		console.error(runError);
	}
};

run();
