const passport = require("passport");
const { User } = require("../../../models/User");

const logOut = (req, res) => {
    req.logout();
    res.redirect("/");
};

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = new User({
            username,
            password,
        });
        await newUser.save();

        passport.authenticate("local")(req, res, function () {
            return res.status(201).json({});
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    logOut,
    register,
};
