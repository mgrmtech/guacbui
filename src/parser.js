const fs = require('fs');
const {
	DATA_FILE,
	DATA_JSON,
} = require('./constants.js')
const { transformCsvStrToArr } = require('./utils.js')

const parser = new (require('simple-excel-to-json').XlsParser)();
const groupTransform = sheet => {
	sheet['permissions.system'] = transformCsvStrToArr(sheet['permissions.system']);
	sheet['permissions.connections'] = transformCsvStrToArr(sheet['permissions.connections']);
};
const userTransform = sheet => {
	sheet['permissions.system'] = transformCsvStrToArr(sheet['permissions.system']);
	sheet['permissions.connections'] = transformCsvStrToArr(sheet['permissions.connections']);
	sheet['userGroups'] = transformCsvStrToArr(sheet['userGroups']);
	sheet['accessWindowStart'] = sheet['accessWindowStart'].replace(/\"/g, '');
	sheet['accessWindowEnd'] = sheet['accessWindowEnd'].replace(/\"/g, '');
	sheet['validFrom'] = sheet['validFrom'].replace(/\"/g, '');
	sheet['validUntil'] = sheet['validUntil'].replace(/\"/g, '');
};

parser.setTranseform([ groupTransform, userTransform ])

let dataFileReadError = null;
try {
	let [groups, users] = parser.parseXls2Json(DATA_FILE, { isNested: true });
	groups = groups.filter(group => !!group.identifier);
	users = users.filter(user => !!user.username);
	const groupUsers = users.reduce(
		(acc, user) => {
			user.userGroups.forEach(group => {
				if (!acc[group]) {
					acc[group] = [user.username];
				} else {
					acc[group].push(user.username);
				}
			});
			return acc;
		}, {}
	);
	fs.writeFileSync(DATA_JSON, JSON.stringify({ groups, users, groupUsers }, null, '\t'));
} catch (error) {
	dataFileReadError = error;
	console.error('DATA ERROR', error);
}
