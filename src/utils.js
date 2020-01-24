const path = require('path');
const fetch = require('node-fetch');
const { SCREENSHOTS_PATH, GUAC_BASE_URL } = require('./constants.js');

const screenshot = async (page, filename) => page.screenshot({
	path: path.join(SCREENSHOTS_PATH, filename),
	fullPage: true,	
});

const fetchUtil = async (url, method = 'GET', body = null, baseURL = GUAC_BASE_URL) => fetch(
	url,
	{
		credentials: 'omit',
		headers: {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/json',
		},
		referrer: `${GUAC_BASE_URL}/`,
		'referrerPolicy': 'no-referrer-when-downgrade',
		body,
		method,
		mode: 'cors',
	}
);

const transformCsvStrToArr = str => str ? str.split(', ').map(e => e.trim()) : [];

module.exports = { screenshot, fetchUtil, transformCsvStrToArr };
