const passport = require("passport");
const isEmail = require("validator/lib/isEmail");
const { User } = require("../../../models/User");

const logOut = (req, res) => {
    req.logout();
    return res.status(200).json({});
};

const register = async (req, res) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (typeof email != "string") errors.email = "email is invalid";
    if (typeof password != "string") errors.password = "password is invalid";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (!isEmail(email + "")) errors.email = "email is invalid";
    if (password.length < 8) errors.password = "password is too weak";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    try {
        const foundUser = await User.findOne({ email });
        if (foundUser) return res.status(400).json({ password: "email already exists" });

        const newUser = new User({
            email,
            password,
        });
        await newUser.save();

        passport.authenticate("local")(req, res, function () {
            return res.status(201).json({});
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (typeof email != "string" || !isEmail(email)) errors.email = "email is invalid";
    if (typeof password != "string") errors.password = "password is invalid";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(404).json({ email: "User not found" });

        const isMatch = foundUser.validatePassword(password);
        if (!isMatch) return res.status(400).json({ password: "password is incorrect" });

        passport.authenticate("local")(req, res, function () {
            return res.status(200).json({});
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    logOut,
    register,
    login,
};
