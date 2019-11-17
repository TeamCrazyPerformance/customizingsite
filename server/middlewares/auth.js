const config = require('../config');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers['x-access-token'], config.secret);
        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(419).json({errorMsg : "Token Expired"});
        }

        return res.status(401).json({errorMsg : "Invalid Token"})
    }
};

module.exports = authMiddleware;