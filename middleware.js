/* eslint-disable require-atomic-updates */

const { User } = require('./database');

// If a request has a jwt token, load the user into req.user
const grabUser = async (req, res, next) => {
	try {
		const { payload } = req;
		if (payload && payload.id) {
			const user = await User.findById(payload.id)
				.lean()
				.exec();
			req.user = user;
		} else {
			req.user = null;
		}
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = { grabUser };
