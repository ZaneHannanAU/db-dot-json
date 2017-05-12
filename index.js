try {
	module.exports = require('./db');
} catch (e) {
	module.exports = require('./_db').default;
}
