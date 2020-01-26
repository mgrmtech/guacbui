const fetch = require('node-fetch');

const fetchUtil = async (baseURL, endpoint, method = 'GET', body = null) => fetch(
	`${baseURL}${endpoint}`,
	{
		credentials: 'omit',
		headers: {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/json'
		},
		referrer: `${baseURL}/`,
		referrerPolicy: 'no-referrer-when-downgrade',
		body,
		method,
		mode: 'cors'
	}
);

const transformCsvStrToArr = str => str ? str.split(', ').map(e => e.trim()) : [];

module.exports = {fetchUtil, transformCsvStrToArr};
