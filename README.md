## GUACBUI?

guacbui aids in importing users, and groups (and their associations) at bulk, on guacamole instances. It also assigns permissions as specified, to users, and groups.

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
- Please look at the `template.xlsx` file inside the `example` folder in this repo, to get an idea on how the data in the excel file — `excelFilePathWithImportData` — should be structured.

### importer: (baseURL, authToken, data) => void
- This function imports all entities (users, groups), associations (users of a group); and approriately assign perms as specified in the `data` object, which can be computed using a corresponding excel file, as follows:
```js
const data = convertXlsxToObj(excelFilePathWithImportData);
```
- `baseURL` is the base URL of the Guacamole instance
- `authToken` is the JSON token of a logged in user with enough administrator privileges to enable guacbui in doing what it does
- `importer` can be safely run even if some of the entities, and associations from `data` have already been imported; `importer` will just update these

### rollback: (baseURL, authToken, data) => void
- This function does the opposite of what `importer` does — it deletes all entities (users, groups), and associations as specified in the `data` object

## Example
- The code inside `example` folder can be perused, to gain a better understanding on consuming guacbui's api.
- Ensure appropriate values are populated inside `example/config.js`, before running the following:
```
$ cd example
$ node index.js
```
