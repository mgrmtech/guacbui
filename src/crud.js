const { fetchUtil } = require('./utils.js');
const { GUAC_BASE_URL } = require('./constants.js');

const createGroup = async (authToken, group) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups?token=${authToken}`,
	'POST',
	JSON.stringify({ identifier: group.identifier, attributes: { disabled: group.disabled } }),
);

const patchGroup = async (authToken, group) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups/${group.identifier}?token=${authToken}`,
	'PUT',
	JSON.stringify({ identifier: group.identifier, attributes: { disabled: group.disabled } }),
);

const createUser = async (authToken, user) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/users?token=${authToken}`,
	'POST',
	JSON.stringify({
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
);

const patchUser = async (authToken, user) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/users/${user.username}?token=${authToken}`,
	'POST',
	JSON.stringify({
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
);

const addUsersToGroup = async (authToken, groupName, users) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups/${groupName}/memberUsers?token=${authToken}`,
	'PATCH',
	JSON.stringify(
		users.map(user => ({ op: 'add', path: '/', value: user }))
	),
);

module.exports = {
	createGroup,
	patchGroup,
	createUser,
	patchUser,
	addUsersToGroup,
};
