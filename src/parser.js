const {transformCsvStrToArr} = require('./utils.js');

const makeXlsxParser = () => {
	const parser = new (require('simple-excel-to-json').XlsParser)();
	const groupTransform = sheet => {
		sheet['permissions.system'] = transformCsvStrToArr(sheet['permissions.system']);
		sheet['permissions.connections'] = transformCsvStrToArr(sheet['permissions.connections']);
	};

	const userTransform = sheet => {
		sheet['permissions.system'] = transformCsvStrToArr(sheet['permissions.system']);
		sheet['permissions.connections'] = transformCsvStrToArr(sheet['permissions.connections']);
		sheet.userGroups = transformCsvStrToArr(sheet.userGroups);
		sheet.accessWindowStart = sheet.accessWindowStart.replace(/"/g, '');
		sheet.accessWindowEnd = sheet.accessWindowEnd.replace(/"/g, '');
		sheet.validFrom = sheet.validFrom.replace(/"/g, '');
		sheet.validUntil = sheet.validUntil.replace(/"/g, '');
	};

	parser.setTranseform([groupTransform, userTransform]);
	return parser;
};

const convertXlsxToObj = xlsxPath => {
	const parser = makeXlsxParser();
	try {
		let [groups, users] = parser.parseXls2Json(xlsxPath, {isNested: true});
		groups = groups.filter(group => Boolean(group.identifier));
		users = users.filter(user => Boolean(user.username));
		const groupUsers = users.reduce(
			(acc, user) => {
				user.userGroups.forEach(group => {
					if (!acc[group]) {
						acc[group] = [];
					}

					acc[group].push(user.username);
				});
				return acc;
			}, {}
		);
		return {groups, users, groupUsers};
	} catch (error) {
		console.error('DATA CONVERSION ERROR', error);
	}
};

module.exports = {convertXlsxToObj};
