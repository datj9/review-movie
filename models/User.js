const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: String,
    tokenResetPassword: String,
    name: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
    },
    facebookId: {
        type: String,
        unique: true,
    },
    userType: {
        type: String,
        required: true,
        default: "client",
    },
    image: String,
    provider: {
        type: String,
        required: true,
        default: "local",
    },
});

UserSchema.methods = {
    validatePassword: async function (inputPassword) {
        const isMatch = await bcrypt.compare(inputPassword, this.password);
        return isMatch;
    },
    hashPassword: async (password) => {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    },
    transform: function () {
        const user = this.toObject();

        user.id = user._id;
        delete user._id;
        delete user.__v;
        delete user.password;

        return user;
    },
};

UserSchema.pre("save", async function (next) {
    if (!this.password) {
        next();
    } else {
        this.password = await this.hashPassword(this.password);
        next();
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = {
    User,
    UserSchema,
};
