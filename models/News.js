const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        isPublic: {
            type: String,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

NewsSchema.methods = {
    transform: function () {
        const obj = this.toObject();

        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;

        return obj;
    },
};

const News = mongoose.model("News", NewsSchema);

module.exports = { NewsSchema, News };
