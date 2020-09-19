const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        averageRating: {
            type: Number,
        },
        thumbnailImage: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

TheaterSchema.methods = {
    transform: function () {
        const obj = this.toObject();

        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;

        return obj;
    },
};

const Theater = mongoose.model("Theater", TheaterSchema);

module.exports = { TheaterSchema, Theater };
