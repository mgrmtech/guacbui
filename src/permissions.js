/* Example permission patches

Connection permissions
0: {op: "add", path: "/connectionPermissions/2", value: "READ"}
1: {op: "add", path: "/connectionGroupPermissions/1", value: "READ"}

Change own password (ONLY FOR USERS, NOT FOR GROUPS)
2: {op: "add", path: "/userPermissions/hell", value: "UPDATE"}

Administer system
3: {op: "add", path: "/systemPermissions", value: "ADMINISTER"}

Create new users
4: {op: "add", path: "/systemPermissions", value: "CREATE_USER"}

Create new user groups
5: {op: "add", path: "/systemPermissions", value: "CREATE_USER_GROUP"}

Create new connections
6: {op: "add", path: "/systemPermissions", value: "CREATE_CONNECTION"}

Create new connection groups
7: {op: "add", path: "/systemPermissions", value: "CREATE_CONNECTION_GROUP"}

Create new sharing profiles
8: {op: "add", path: "/systemPermissions", value: "CREATE_SHARING_PROFILE"}
*/
const createPermAssigner = (options = { isGroup: false }) => async (authToken, username, permissions) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/user`${options.isGroup ? 'Group' : ''}`s/${username}/permissions?token=${authToken}`,
	'PATCH',
	JSON.stringify(
		permissions.map(perm => ({ op: 'add', path: perm.path, value: perm.value }))
	),
);
const assignPermissionsToUser = createPermAssigner();
const assignPermissionsToGroup = createPermAssigner({ isGroup: true });

/*
Example permissions object
permissions: {
	connections: ['AIS-Employees', 'M-Star SES - AIS', 'Google Chrome-Mdemo'], // TODO: Error check - 'Hoorah'],
	system: [ // TODO: Error check - 'CREATE_HOORAH'
		'ADMINISTER',
		'CREATE_USER',
		'CREATE_USER_GROUP',
		'CREATE_CONNECTION',
		'CREATE_CONNECTION_GROUP',
		'CREATE_SHARING_PROFILE',
	],
	userUpdate: true,
}
*/
const getPathValArrFromPermObj = (permissions, connPathMap, username = null) => {
	const pathValArr = [];
	if (permissions.system) {
		permissions.system.forEach(val => {
			if (POSSIBLE_SYSTEM_PERMISSIONS.includes(val)) {
				pathValArr.push({ path: '/systemPermissions', value: val });
			}
		});
	}
	if (permissions.connections) {
		permission.connections.forEach(conn => {
			const connPath = connPathMap[conn];
			if (connPath) {
				pathValArr.push({ path: connPath, value: 'READ' });
			}
		})
	}
	if (permissions.userUpdate) {
		pathValArr.push({ path: `/userPermissions/${username}`, value: 'UPDATE' });
	}
};

module.exports = { assignPermissionsToUser, assignPermissionsToGroup, getPathValArrFromPermObj };