const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/index");

const auth = () => {
    return async (req , res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new Error("you are not authorized!")
            }
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded.email
            next();
        } catch (err) {
            next(err)
        }
    }
}

module.exports = {
    auth
}