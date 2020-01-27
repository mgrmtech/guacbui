## GUACBUI?

guacbui aids you with importing users, and groups (and their associations) at bulk, on your guacamole instances. It also assigns permissions as specified, to users, and groups.

## Usage

```bash
$ npm install guacbui
```

guacbui exposes three functions:
```js
const {
	convertXlsxToObj,
	imporer,
	rollback
} = require('guacbui');
```

### convertXlsxToObj: (excelFilePathWithImportData) => importData
- Please look at the `template.xlsx` file inside the `example` folder in this repo, to get an idea on how we should structure the data in the excel file — `excelFilePathWithImportData`.

### importer: (baseURL, authToken, data) => void
- This function imports all users, groups, userGroupAssociations; and approriately assign perms as specified in the `data` object:
```js
const data = convertXlsxToObj(excelFilePathWithImportData);
```
- `baseURL` is the base URL of the Guacamole instance
- `authToken` is the JSON token of a logged in user with enough administrator privileges to enable guacbui in doing what it does
- We can safely run `importer` even if some of the entities, associations from `data` have already been imported; `importer` will just update these


### rollback: (baseURL, authToken, data) => void
- This function only differs from `importer` in the aspect that it completely rolls back any entity, association as specified in the `data` object

## Example
- You can peruse the code inside `example` folder to gain a better understanding of the behind-the-scenes of guacbui.
- Ensure appropriate values are populated inside `example/config.js`, before running the following:
```
$ cd example
$ node index.js
```
