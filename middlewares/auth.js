const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const authenticate = (req, res, next) => {
    const { is_client_side: isClientSide = false, token } = req.headers;
    const { user } = req;

    try {
        if (isClientSide == false && user) {
            next();
        } else if (isClientSide && token) {
            const user = jwt.verify(token, jwtSecretKey);

            req.user = user;
            next();
        } else {
            return res.status(401).json({});
        }
    } catch (error) {
        return res.status(401).json(error);
    }
};

const authorize = (allowedUserTypes = []) => (req, res, next) => {
    const { user } = req;

    if (allowedUserTypes.findIndex((type) => type == user.userType) >= 0) {
        next();
    } else {
        return res.status(401).json({ error: "User is not allowed" });
    }
};

module.exports = { authenticate, authorize };
