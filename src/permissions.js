const {POSSIBLE_SYSTEM_PERMISSIONS} = require('./constants.js');
const {fetchUtil} = require('./utils.js');

const getPathValArr = (permissions, connPathMap, username = null) => {
	const pathValArr = [];
	if (permissions.system) {
		permissions.system.forEach(val => {
			if (POSSIBLE_SYSTEM_PERMISSIONS.includes(val)) {
				pathValArr.push({
					path: val === 'UPDATE' ? `/userPermissions/${username}` : '/systemPermissions',
					val
				});
			}
		});
	}

	if (permissions.connections) {
		permissions.connections.forEach(conn => {
			const connPath = connPathMap[conn];
			if (connPath) {
				pathValArr.push({path: connPath, value: 'READ'});
			}
		});
	}

	return pathValArr;
};

const createPermAssigner = (options = {isGroup: false}) => async (
	authToken,
	entity,
	connectionPathMap,
	baseURL,
) => {
	const pathValArr = getPathValArr(
		entity.permissions,
		connectionPathMap,
		options.isGroup ? null : entity.username
	);
	return fetchUtil(
		baseURL,
		`/api/session/data/mysql/user${
			options.isGroup ? 'Group' : ''
		}s/${entity.username}/permissions?token=${authToken}`,
		'PATCH',
		JSON.stringify(
			pathValArr.map(e => ({op: 'add', path: e.path, value: e.value}))
		)
	);
};

const assignPermissionsToUser = createPermAssigner();
const assignPermissionsToGroup = createPermAssigner({isGroup: true});

module.exports = {assignPermissionsToUser, assignPermissionsToGroup};
