const {getConnectionPathMap} = require('./connections.js');

const {
	createOrUpdateGroupsAndAssignPerms,
	createOrUpdateUsersAndAssignPerms,
	addUsersToGroups,
	deleteUsers,
	deleteGroups
} = require('./bulkops.js');

const importer = async (guacBaseURL, authToken, data) => {
	try {
		const {groups, users, groupUsers} = data;

		const connectionPathMap = await getConnectionPathMap(authToken);
		await createOrUpdateGroupsAndAssignPerms(authToken, groups, connectionPathMap);
		await createOrUpdateUsersAndAssignPerms(authToken, users, connectionPathMap);
		await addUsersToGroups(authToken, groupUsers);
	} catch (error) {
		console.error(error);
	}
};

const rollback = async (guacBaseURL, authToken, data) => {
	try {
		const {groups, users} = data;

		await deleteUsers(authToken, users);
		await deleteGroups(authToken, groups);
	} catch (error) {
		console.error(error);
	}
};

module.exports = {importer, rollback};
