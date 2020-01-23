// Fetch connections
// http://202.137.228.197:8080/guacamole/api/session/data/mysql/connectionGroups/ROOT/tree?token=54B0E103651AD58A2A8195CD39C30F39D90374C81B25A5B1FF8C7E73B1D8E26D


const connectionsObj = {
  "name": "ROOT",
  "identifier": "ROOT",
  "type": "ORGANIZATIONAL",
  "activeConnections": 0,
  "childConnectionGroups": [
    {
      "name": "AIS-Employees",
      "identifier": "1",
      "parentIdentifier": "ROOT",
      "type": "ORGANIZATIONAL",
      "activeConnections": 0,
      "childConnectionGroups": [
        {
          "name": "Hello",
          "identifier": "2",
          "parentIdentifier": "1",
          "type": "ORGANIZATIONAL",
          "activeConnections": 0,
          "childConnectionGroups": [
            {
              "name": "Hello2",
              "identifier": "3",
              "parentIdentifier": "2",
              "type": "ORGANIZATIONAL",
              "activeConnections": 0,
              "attributes": {
                "max-connections": null,
                "max-connections-per-user": null,
                "enable-session-affinity": ""
              }
            }
          ],
          "childConnections": [
            {
              "name": "HelloConn",
              "identifier": "3",
              "parentIdentifier": "2",
              "protocol": "vnc",
              "attributes": {
                "guacd-encryption": null,
                "failover-only": null,
                "weight": null,
                "max-connections": null,
                "guacd-hostname": null,
                "guacd-port": null,
                "max-connections-per-user": null
              },
              "activeConnections": 0
            }
          ],
          "attributes": {
            "max-connections": null,
            "max-connections-per-user": null,
            "enable-session-affinity": ""
          }
        }
      ],
      "childConnections": [
        {
          "name": "M-Star SES - AIS",
          "identifier": "1",
          "parentIdentifier": "1",
          "protocol": "rdp",
          "attributes": {
            "guacd-encryption": null,
            "failover-only": null,
            "weight": null,
            "max-connections": null,
            "guacd-hostname": null,
            "guacd-port": null,
            "max-connections-per-user": null
          },
          "activeConnections": 0,
          "lastActive": 1579783831000
        }
      ],
      "attributes": {
        "max-connections": null,
        "max-connections-per-user": null,
        "enable-session-affinity": ""
      }
    }
  ],
  "childConnections": [
    {
      "name": "Google Chrome-Mdemo",
      "identifier": "2",
      "parentIdentifier": "ROOT",
      "protocol": "rdp",
      "attributes": {
        "guacd-encryption": null,
        "failover-only": null,
        "weight": null,
        "max-connections": null,
        "guacd-hostname": null,
        "guacd-port": null,
        "max-connections-per-user": null
      },
      "activeConnections": 0,
      "lastActive": 1579355469000
    }
  ],
  "attributes": {
    
  }
}

// fetch(
// 	`${GUAC_BASE_URL}/api/session/data/mysql/users/${username}/permissions?token=${authToken}`,
// 	{
// 		credentials: 'omit',
// 		headers: {
// 			accept: 'application/json, text/plain, */*',
// 			'accept-language': 'en-US,en;q=0.9',
// 			'content-type': 'application/json',
// 		},
// 		referrer: `${GUAC_BASE_URL}/`,
// 		referrerPolicy: 'no-referrer-when-downgrade',
// 		body: JSON.stringify([{ op: 'add', path: '/connectionPermissions/2', value: 'READ' }]),
// 		method: 'PATCH',
// 		'mode': 'cors'
// 	}
// );

/* Permissions

Connection permissions
0: {op: "add", path: "/connectionPermissions/2", value: "READ"}
1: {op: "add", path: "/connectionGroupPermissions/1", value: "READ"}

// Change own password
2: {op: "add", path: "/userPermissions/hell", value: "UPDATE"}

// Administer system
3: {op: "add", path: "/systemPermissions", value: "ADMINISTER"}

// Create new users
4: {op: "add", path: "/systemPermissions", value: "CREATE_USER"}

// Create new user ggroups
5: {op: "add", path: "/systemPermissions", value: "CREATE_USER_GROUP"}

//  Create new connections
6: {op: "add", path: "/systemPermissions", value: "CREATE_CONNECTION"}

// Create new connection groups
7: {op: "add", path: "/systemPermissions", value: "CREATE_CONNECTION_GROUP"}

// Create new sharing profiles
8: {op: "add", path: "/systemPermissions", value: "CREATE_SHARING_PROFILE"}
*/

const parseConnections = rootConnObj => {
	const { childConnections, childConnectionGroups } = rootConnObj;
	const connectionOpPathMap = {};

	const parseChildConnectionGroups = groups => {
		groups.forEach(group => {
			connectionOpPathMap[group.name] = `/connectionGroupPermissions/${group.identifier}`;
			if (group.childConnectionGroups) parseChildConnectionGroups(group.childConnectionGroups);
			if (group.childConnections) parseChildConnections(group.childConnections);
		});
	};

	const parseChildConnections = connections => {
		connections.forEach(connection => {
			connectionOpPathMap[connection.name] = `/connectionPermissions/${connection.identifier}`;
		});
	};

	parseChildConnectionGroups(childConnectionGroups);
	parseChildConnections(childConnections);

	return connectionOpPathMap;
}

console.log(parseConnections(connectionsObj));