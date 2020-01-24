const { fetchUtil } = require('./utils.js');
const { GUAC_BASE_URL } = require('./constants.js');

const createGroup = async (authToken, group) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups?token=${authToken}`,
	'POST',
	JSON.stringify({ identifier: group.identifier, attributes: { disabled: group.disabled === 'Y' } }),
);

const readGroup = async (authToken, group) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups/${group.identifier}?token=${authToken}`,
);

const updateGroup = async (authToken, group) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups/${group.identifier}?token=${authToken}`,
	'PUT',
	JSON.stringify({ identifier: group.identifier, attributes: { disabled: group.disabled === 'Y' } }),
);

const deleteGroup = async (authToken, group) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups/${group.identifier}?token=${authToken}`,
	'DELETE',
);

const createUser = async (authToken, user) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/users?token=${authToken}`,
	'POST',
	JSON.stringify({
		username: user.username,
		password: user.password,
		attributes: {
			disabled: user.loginDisabled === 'Y',
			expired: user.passwordExpired === 'Y',
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

const readUser = async (authToken, user) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/users/${user.username}?token=${authToken}`,
);

const updateUser = async (authToken, user) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/users/${user.username}?token=${authToken}`,
	'PUT',
	JSON.stringify({
		username: user.username,
		password: user.password,
		attributes: {
			disabled: user.loginDisabled === 'Y',
			expired: user.passwordExpired === 'Y',
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

const deleteUser = async (authToken, user) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/users/${user.username}?token=${authToken}`,
	'DELETE',
);

const addUsersToGroup = async (authToken, groupName, usernames) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/userGroups/${groupName}/memberUsers?token=${authToken}`,
	'PATCH',
	JSON.stringify(
		usernames.map(username => ({ op: 'add', path: '/', value: username }))
	),
);

module.exports = {
	createGroup,
	readGroup,
	updateGroup,
	deleteGroup,
	createUser,
	readUser,
	updateUser,
	deleteUser,
	addUsersToGroup,
};
