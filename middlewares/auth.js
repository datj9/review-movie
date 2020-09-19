const authenticate = (req, res, next) => {
    const { user } = req;

    if (!user) return res.status(401).json({});
    next();
};

const authorize = (allowedUserTypes = []) => (req, res, next) => {
    const { user } = req;

    if (allowedUserTypes.findIndex(user.userType) == -1) return res.status(401).json({ error: "User is not allowed" });

    next();
};

module.exports = { authenticate, authorize };
