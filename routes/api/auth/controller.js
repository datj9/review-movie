const passport = require("passport");
const { User } = require("../../../models/User");

const logOut = (req, res) => {
    req.logout();
    res.redirect("/");
};

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ username });
        if (foundUser) return res.status(400).json({ username: "username already exists" });

        const newUser = new User({
            username,
            password,
        });
        await newUser.save();

        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    logOut,
    register,
};
