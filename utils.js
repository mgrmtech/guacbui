const path = require('path');
const { SCREENSHOTS_PATH } = require('./constants.js');

const screenshot = async (page, filename) => page.screenshot({ path: path.join(SCREENSHOTS_PATH, filename) });

module.exports = { screenshot };
