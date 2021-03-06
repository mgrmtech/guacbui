/* eslint-disable no-await-in-loop */
const {
	createGroup,
	readGroup,
	updateGroup,
	deleteGroup,
	createUser,
	readUser,
	updateUser,
	deleteUser,
	addUsersToGroup
} = require('./crudops.js');

const {
	assignPermissionsToUser,
	assignPermissionsToGroup
} = require('./permissions.js');

const createOrUpdateGroupsAndAssignPerms = async (authToken, groups, connectionPathMap, baseURL) => {
	for (const group of groups) {
		// Create/Update the group
		console.log(`Trying to fetch the user group "${group.identifier}"...`);
		const groupObj = await (await readGroup(authToken, group, baseURL)).json();
		if (groupObj.type === 'NOT_FOUND') {
			console.log(`Didn't find the user group "${group.identifier}", creating it now...`);
			await createGroup(authToken, group, baseURL);
			console.log(`Created the user group "${group.identifier}.\n`);
		} else if (groupObj.identifier === group.identifier) {
			console.log(`Found the user group "${group.identifier}", updating it now...`);
			await updateGroup(authToken, group, baseURL);
			console.log(`Updated the user group "${group.identifier}.\n`);
		}

		// Assign permissions to the group
		console.log(`Assigning permissions to the group "${group.identifier}"...`);
		await assignPermissionsToGroup(authToken, group, connectionPathMap, baseURL);
		console.log(`Assigned permissions to the group "${group.identifier}".\n`);
	}
};

const createOrUpdateUsersAndAssignPerms = async (authToken, users, connectionPathMap, baseURL) => {
	for (const user of users) {
		// Create/Update the user
		console.log(`Trying to fetch the user "${user.username}"...`);
		const userObj = await (await readUser(authToken, user, baseURL)).json();
		if (userObj.type === 'NOT_FOUND') {
			console.log(`Didn't find the user "${user.username}", creating this user now...`);
			await createUser(authToken, user, baseURL);
			console.log(`Created the user "${user.username}.\n`);
		} else if (userObj.username === user.username) {
			console.log(`Found the user "${user.username}", updating this user now...`);
			await updateUser(authToken, user, baseURL);
			console.log(`Updated the user "${user.username}.\n`);
		}

		// Assign permissions to the user
		console.log(`Assigning permissions to the user "${user.username}"...`);
		await assignPermissionsToUser(authToken, user, connectionPathMap, baseURL);
		console.log(`Assigned permissions to the user "${user.username}".\n`);
	}
};

const addUsersToGroups = async (authToken, groupUsers, baseURL) => {
	const groupIdentifiers = Object.keys(groupUsers);
	for (const groupIdentifier of groupIdentifiers) {
		console.log(`Adding users to the group "${groupIdentifier}...`);
		await addUsersToGroup(authToken, groupIdentifier, groupUsers[groupIdentifier], baseURL);
		console.log(`Added users to the group "${groupIdentifier}.\n`);
	}
};

const deleteGroups = async (authToken, groups, baseURL) => {
	for (const group of groups) {
		// Delete group
		console.log(`Trying to fetch the user group "${group.identifier}"...`);
		const groupObj = await (await readGroup(authToken, group, baseURL)).json();
		if (groupObj.type === 'NOT_FOUND') {
			console.log(`Didn't find the user group "${group.identifier}", no further action needed.\n`);
		} else if (groupObj.identifier === group.identifier) {
			console.log(`Found the user group "${group.identifier}", deleting it now...`);
			await deleteGroup(authToken, group, baseURL);
			console.log(`Deleted the user group "${group.identifier}.\n`);
		}
	}
};

const deleteUsers = async (authToken, users, baseURL) => {
	for (const user of users) {
		// Delete user
		console.log(`Trying to fetch the user "${user.username}"...`);
		const userObj = await (await readUser(authToken, user, baseURL)).json();
		if (userObj.type === 'NOT_FOUND') {
			console.log(`Didn't find the user "${user.username}", no further action needed.\n`);
		} else if (userObj.username === user.username) {
			console.log(`Found the user "${user.username}", deleting this user now...`);
			await deleteUser(authToken, user, baseURL);
			console.log(`Deleted the user "${user.username}.\n`);
		}
	}
};

module.exports = {
	createOrUpdateGroupsAndAssignPerms,
	createOrUpdateUsersAndAssignPerms,
	addUsersToGroups,
	deleteGroups,
	deleteUsers
};
