const jwt = require('jsonwebtoken');
require('dotenv').config();

// store data in token
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

// verify if authenticated
module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (typeof token === 'undefined') {
		return res.status(401).send({ error: "Unauthorized adventure. Please log in!" })
	}

	token = token.slice(7);

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
		if (err) {
			return res.status(403).send({
				error: "Adventurer Token is fake or expired!"
			});
		} else {
			req.user = decodedToken;
			next();
		}
	});
};

// Admin verification
module.exports.verifyAdmin = (req, res, next) => {
	if (req.user.isAdmin) {
		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
            message: "Action Forbidden. Guild Master clearance required!"
		})
	}
}

// Error handler
module.exports.errorHandler = (err, req, res, next) => {

    console.error(err); 
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Dungeon trap activated! System error.';

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'DUNGEON FAIL',
            details: err.details || null
        }
    })
}