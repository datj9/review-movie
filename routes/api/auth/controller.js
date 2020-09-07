const passport = require("passport");
const isEmail = require("validator/lib/isEmail");
const isInt = require("validator/lib/isInt");
const { User } = require("../../../models/User");
const { sendEmailRecoverPassword } = require("../../../helpers/sendEmail");
const bcrypt = require("bcryptjs");
const { hotp } = require("otplib");
const { promisify } = require("util");
const hashPass = promisify(bcrypt.hash);
const otpSecret = process.env.OTP_SECRET;
let counter = Math.floor(Math.random() * Math.pow(10, 6));

hotp.options = {
    algorithm: "sha256",
    digits: 8,
};

const logOut = (req, res) => {
    req.logout();
    return res.status(200).json({});
};

const register = async (req, res) => {
    const { email, password, name } = req.body;
    const errors = {};

    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";
    if (!name) errors.name = "name is required";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (typeof email != "string") errors.email = "email is invalid";
    if (typeof password != "string") errors.password = "password is invalid";
    if (typeof name != "string") errors.password = "name is invalid";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    if (!isEmail(email + "")) errors.email = "email is invalid";
    if (password.length < 8) errors.password = "password is too weak";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    try {
        const foundUser = await User.findOne({ email, provider: "local" });
        if (foundUser) return res.status(400).json({ email: "email already exists" });

        const newUser = new User({
            email,
            password,
            name,
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
        const foundUser = await User.findOne({ email, provider: "local" });
        if (!foundUser) return res.status(404).json({ email: "User not found" });

        const isMatch = await foundUser.validatePassword(password);

        if (!isMatch) return res.status(400).json({ password: "password is incorrect" });

        passport.authenticate("local")(req, res, function () {
            return res.status(200).json({});
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const sendEmailToRecoverAccount = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ email: "email is required" });
    if (typeof email != "string" || !isEmail(email)) return res.status(400).json({ email: "email is invalid" });

    const token = hotp.generate(otpSecret, counter);
    const { isSuccess } = await sendEmailRecoverPassword(email, token);

    if (isSuccess) {
        return res.status(200).json({});
    } else {
        return res.status(500).json({});
    }
};
const checkVerifyToken = async (req, res) => {
    const { token } = req.body;

    if (typeof token != "string" || !isInt(token)) return res.status(400).json({ token: "token is invalid" });

    try {
        const isValid = hotp.check(token, otpSecret, counter);

        if (!isValid) {
            return res.status(400).json({ isValid });
        } else {
            return res.status(200).json({ isValid });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
const changePasswordByVerifyingEmail = async (req, res) => {
    const { email, password, confirmPassword, token } = req.body;
    const errors = {};

    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";
    if (!confirmPassword) errors.confirmPassword = "confirmPassword is required";
    if (!token) errors.token = "token is required";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    if (typeof email != "string" || !isEmail(email)) errors.email = "email is invalid";
    if (typeof password != "string" || password.length < 8) errors.password = "password is invalid";
    if (typeof confirmPassword != "string" || confirmPassword.length < 8)
        errors.confirmPassword = "confirmPassword is invalid";
    if (typeof token != "string") errors.token = "token is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);
    if (password != confirmPassword) return res.status(400).json({ confirmPassword: "confirmPassword does not match" });

    try {
        const isValid = hotp.check(token, otpSecret, counter);
        if (!isValid) return res.status(400).json({ token: "token is invalid", isValid });

        counter = Math.floor(Math.random() * Math.pow(10, 6));
        const hash = await hashPass(password, 10);
        await User.updateOne({ email }, { password: hash });

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
    sendEmailToRecoverAccount,
    checkVerifyToken,
    changePasswordByVerifyingEmail,
};
