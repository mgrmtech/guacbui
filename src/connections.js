const { fetchUtil } = require('./utils.js');
const { GUAC_BASE_URL, POSSIBLE_SYSTEM_PERMISSIONS } = require('./constants.js');

const fetchConnectionTree = async (authToken) => fetchUtil(
	`${GUAC_BASE_URL}/api/session/data/mysql/connectionGroups/ROOT/tree?token=${authToken}`,
);

const getConnectionPathMap = rootConnObj => {
	const { childConnections, childConnectionGroups } = rootConnObj;
	const connectionPathMap = {};

	const parseChildConnectionGroups = groups => {
		groups.forEach(group => {
			connectionPathMap[group.name] = `/connectionGroupPermissions/${group.identifier}`;
			if (group.childConnectionGroups) parseChildConnectionGroups(group.childConnectionGroups);
			if (group.childConnections) parseChildConnections(group.childConnections);
		});
	};

	const parseChildConnections = connections => {
		connections.forEach(connection => {
			connectionPathMap[connection.name] = `/connectionPermissions/${connection.identifier}`;
		});
	};

	parseChildConnectionGroups(childConnectionGroups);
	parseChildConnections(childConnections);

	return connectionPathMap;
};

module.exports = { fetchConnectionTree, getConnectionPathMap };