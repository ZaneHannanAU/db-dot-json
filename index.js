try {
	module.exports = require('./db');
} catch (e) {
	module.exports = (
		require('./_db').default ||
		require('./_db').DBDotJSON ||
		require('./_db')
	);
}
