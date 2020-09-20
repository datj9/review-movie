const passport = require("passport");
const isEmail = require("validator/lib/isEmail");
const isInt = require("validator/lib/isInt");
const { User } = require("../../../models/User");
const { sendEmailRecoverPassword } = require("../../../helpers/sendEmail");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const hashPass = promisify(bcrypt.hash);
const jwt = require("jsonwebtoken");
const signToken = promisify(jwt.sign);
const jwtSecretKey = process.env.JWT_SECRET_KEY;

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
    const { is_client_side: isClientSide = false } = req.headers;

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

        if (isClientSide == false) {
            passport.authenticate("local")(req, res, function () {
                return res.status(200).json({});
            });
        } else {
            const token = await signToken(foundUser.transform(), jwtSecretKey, { expiresIn: "1h" });

            return res.status(200).json({ token });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const sendEmailToRecoverAccount = async (req, res) => {
    const { email } = req.body;
    const randomPassword = Math.floor(Math.random() * 9 * Math.pow(10, 7)) + Math.pow(10, 7) + "";

    if (!email) return res.status(400).json({ email: "email is required" });
    if (!isEmail(email + "")) return res.status(400).json({ email: "email is invalid" });

    try {
        const user = await User.findOne({ email, provider: "local" });
        if (!user || user.provider != "local") return res.status(404).json({ email: "User not found" });

        const { isSuccess } = await sendEmailRecoverPassword(email, randomPassword);

        if (isSuccess) {
            const tokenResetPassword = await hashPass(randomPassword, 10);

            await User.updateOne({ email, provider: "local" }, { tokenResetPassword });

            return res.status(200).json({});
        } else {
            console.log(isSuccess);
            return res.status(500).json({});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
const checkVerifyToken = async (req, res) => {
    const { token, email } = req.body;

    if (!isEmail(email + "")) return res.status(400).json({ email: "email is invalid" });
    if (!isInt(token + "") || token.length != 8) return res.status(400).json({ token: "token is invalid" });

    try {
        const user = await User.findOne({ email, provider: "local" });
        const isValid = await bcrypt.compare(token, user.tokenResetPassword);

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
    if (password != confirmPassword) return res.status(400).json({ confirmPassword: "confirmPassword does not match" });
    if (!isInt(token + "") || token.length != 8) errors.token = "token is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        const user = await User.findOne({ email, provider: "local" });
        const isValid = await bcrypt.compare(token, user.tokenResetPassword);

        if (!isValid) return res.status(400).json({ token: "token is invalid", isValid });

        const hash = await hashPass(password, 10);
        await User.updateOne({ email, provider: "local" }, { password: hash, tokenResetPassword: null });

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
