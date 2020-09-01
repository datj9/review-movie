const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    googleId: String,
    facebookId: String,
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
    transform: () => {
        console.log("this", this.toObject());
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
