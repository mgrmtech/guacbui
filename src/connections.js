const {fetchUtil} = require('./utils.js');

const fetchConnectionTree = async authToken => fetchUtil(
	`/api/session/data/mysql/connectionGroups/ROOT/tree?token=${authToken}`
);

const makeConnectionPathMap = rootConnObj => {
	const {childConnections, childConnectionGroups} = rootConnObj;
	const connectionPathMap = {};

	const parseChildConnectionGroups = groups => {
		groups.forEach(group => {
			connectionPathMap[group.name] = `/connectionGroupPermissions/${group.identifier}`;
			if (group.childConnectionGroups) {
				parseChildConnectionGroups(group.childConnectionGroups);
			}

			if (group.childConnections) {
				parseChildConnections(group.childConnections);
			}
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

const getConnectionPathMap = async authToken => {
	const connectionTree = await (await fetchConnectionTree(authToken)).json();
	return makeConnectionPathMap(connectionTree);
};

module.exports = {getConnectionPathMap};
