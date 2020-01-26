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

		const connectionPathMap = await getConnectionPathMap(authToken, guacBaseURL);
		await createOrUpdateGroupsAndAssignPerms(authToken, groups, connectionPathMap, guacBaseURL);
		await createOrUpdateUsersAndAssignPerms(authToken, users, connectionPathMap, guacBaseURL);
		await addUsersToGroups(authToken, groupUsers, guacBaseURL);
	} catch (error) {
		console.error(error);
	}
};

const rollback = async (guacBaseURL, authToken, data) => {
	try {
		const {groups, users} = data;

		await deleteUsers(authToken, users, guacBaseURL);
		await deleteGroups(authToken, groups, guacBaseURL);
	} catch (error) {
		console.error(error);
	}
};

module.exports = {importer, rollback};
