const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    googleId: String,
    facebookId: String,
    name: String,
    image: String,
});
UserSchema.plugin(findOrCreate);
const User = mongoose.model("User", UserSchema);

module.exports = { User, UserSchema };
