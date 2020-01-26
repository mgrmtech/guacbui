const {importer, rollback} = require('./src/importer.js');
const {convertXlsxToObj} = require('./src/parser.js');

const {runCli} = require('./cli');

runCli(importer, rollback, convertXlsxToObj);
