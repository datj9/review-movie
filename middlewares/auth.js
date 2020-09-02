// const jwt = require("jsonwebtoken");
// const privateKey = process.env.JWT_PRIVATE_KEY;

// const authenticate = async (req, res, next) => {
//     const { token } = req.headers;

//     if (!token) return res.status(401).json({ error: "Token is required" });
//     jwt.verify(token, privateKey, function (err, decoded) {
//         if (err) return res.status(401).json(err);
//         req.user = decoded;
//         next();
//     });
// };

// const authorize = (allowedUserTypes = []) => (req, res, next) => {
//     const indexOfUserType = allowedUserTypes.findIndex((type) => type == req.user.userType);

//     if (indexOfUserType == -1) return res.status(401).json({ error: "User is unauthorized" });
//     next();
// };

// module.exports = { authenticate, authorize };
