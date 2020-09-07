const mongoose = require("mongoose");

const VerifyCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    expVerifyEmail: {
        type: Number,
        required: true,
    },
    expUpdatePassword: {
        type: Number,
        required: true,
    },
    validatedEmail: {
        type: Boolean,
        default: false,
        required: true,
    },
});

VerifyCodeSchema.methods = {
    transform: function () {
        const obj = this.toObject();

        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;

        return obj;
    },
};

module.exports = mongoose.model("VerifyCode", VerifyCodeSchema);
