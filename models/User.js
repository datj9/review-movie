const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    email: String,
    googleId: {
        type: String,
        unique: true,
    },
    facebookId: {
        type: String,
        unique: true,
    },
    name: String,
    image: String,
});

UserSchema.methods = {
    validatePassword: async (inputPassword, hash) => {
        const isMatch = await bcrypt.compare(inputPassword, hash);
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

module.exports = { User, UserSchema };
