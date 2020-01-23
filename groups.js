// Adding users to a group
// fetch(
// 	"http://202.137.228.197:8080/guacamole/api/session/data/mysql/userGroups/ASDF/memberUsers?token=68E094636AA2864D9D8A24E5D78E9F3A893B1ADFC50E3101988FEC9E0CB76250",
// 	{
// 		"credentials":"omit",
// 		"headers":{
// 			"accept":"application/json, text/plain, */*",
// 			"accept-language":"en-US,en;q=0.9",
// 			"content-type":"application/json"
// 		},
// 		"referrer":"http://202.137.228.197:8080/guacamole/",
// 		"referrerPolicy":"no-referrer-when-downgrade",
// 		"body":"[{\"op\":\"add\",\"path\":\"/\",\"value\":\"RaviVarma\"}]",
// 		"method":"PATCH",
// 		"mode":"cors"
// 	}
// );

// Creating a group
// fetch(
// 	"http://202.137.228.197:8080/guacamole/api/session/data/mysql/userGroups?token=68E094636AA2864D9D8A24E5D78E9F3A893B1ADFC50E3101988FEC9E0CB76250",
// 	{
// 		"credentials":"omit",
// 		"headers":{
// 			"accept":"application/json, text/plain, */*",
// 			"accept-language":"en-US,en;q=0.9",
// 			"content-type":"application/json;charset=UTF-8"
// 		},
// 		"referrer":"http://202.137.228.197:8080/guacamole/",
// 		"referrerPolicy":"no-referrer-when-downgrade",
// 		"body":"{\"identifier\":\"ht\",\"attributes\":{\"disabled\":\"true\"}}",
// 		"method":"POST",
// 		"mode":"cors"
// 	}
// );

// Changing a group's permissions
// fetch(
// 	"http://202.137.228.197:8080/guacamole/api/session/data/mysql/userGroups/ASDF/permissions?token=68E094636AA2864D9D8A24E5D78E9F3A893B1ADFC50E3101988FEC9E0CB76250",
// 	{
// 		"credentials":"omit",
// 		"headers":{
// 			"accept":"application/json, text/plain, */*",
// 			"accept-language":"en-US,en;q=0.9",
// 			"content-type":"application/json"
// 		},
// 		"referrer":"http://202.137.228.197:8080/guacamole/",
// 		"referrerPolicy":"no-referrer-when-downgrade",
// 		"body":[
// 			{\"op\":\"add\",\"path\":\"/connectionPermissions/2\",\"value\":\"READ\"},
// 			{\"op\":\"add\",\"path\":\"/connectionGroupPermissions/1\",\"value\":\"READ\"},
// 			{\"op\":\"add\",\"path\":\"/systemPermissions\",\"value\":\"ADMINISTER\"},
// 			{\"op\":\"add\",\"path\":\"/systemPermissions\",\"value\":\"CREATE_USER\"},
// 			{\"op\":\"add\",\"path\":\"/systemPermissions\",\"value\":\"CREATE_USER_GROUP\"},
// 			{\"op\":\"add\",\"path\":\"/systemPermissions\",\"value\":\"CREATE_CONNECTION\"},
// 			{\"op\":\"add\",\"path\":\"/systemPermissions\",\"value\":\"CREATE_CONNECTION_GROUP\"},
// 			{\"op\":\"add\",\"path\":\"/systemPermissions\",\"value\":\"CREATE_SHARING_PROFILE\"}
// 		],
// 		"method":"PATCH",
// 		"mode":"cors"
// 	}
// );
