const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        },
        theater: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Theater",
        },
    },
    { timestamps: true }
);

ReviewSchema.methods = {
    transform: function () {
        const review = this.toObject();

        review.id = review._id;
        delete review._id;
        delete review.__v;

        return review;
    },
};

const Review = mongoose.model("Review", ReviewSchema);

module.exports = { ReviewSchema, Review };
