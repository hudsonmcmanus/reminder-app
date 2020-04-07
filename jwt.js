const jwt = require('jsonwebtoken');

// Parse and renew jwt tokens
// Sets req.payload to an object if it has a valid jwt token
module.exports = ({ secret, expireIn }) => (req, res, next) => {
	const signCookie = (payload) => {
		if (expireIn) {
			payload.exp = Math.floor(Date.now() / 1000) + expireIn;
		}

		res.cookie('token', jwt.sign(payload, secret));
	};

	res.login = signCookie;
	req.payload = null;

	try {
		const token = req.cookies.token || req.get('Authorization');
		if (token) {
			req.payload = jwt.verify(token, secret);
			signCookie(req.payload);
		}
	} catch (err) {
		// Ignore
	}

	next();
};
