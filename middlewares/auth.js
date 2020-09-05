const authenticate = (req, res, next) => {
    const { user } = req;

    if (!user) return res.status(401).json({});
    next();
};

const authorize = (req, res, next) => {
    const { user } = req;

    if (user.userType != "admin") return res.status(401).json({ error: "User is not allowed" });
    next();
};

module.exports = { authenticate, authorize };
