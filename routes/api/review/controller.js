const { Review } = require("../../../models/Review");
const ObjectId = require("mongoose").Types.ObjectId;
const isInt = require("validator/lib/isInt");

const getReviews = async (req, res) => {
    const { movieId, theaterId, pageSize, pageIndex } = req.query;
    const limit = isInt(pageSize + "") ? +pageSize : 10;
    const skip = isInt(pageIndex + "") ? (+pageIndex - 1) * limit : 0;

    if (!movieId && !theaterId) return res.status(400).json({ error: "movieId or theater is required" });
    if (movieId && !ObjectId.isValid(movieId)) {
        return res.status(400).json({ error: "movieId is invalid" });
    }
    if (theaterId && !ObjectId.isValid(theaterId)) {
        return res.status(400).json({ error: "theaterId is invalid" });
    }

    try {
        const filter = movieId ? { movie: movieId } : { theater: theaterId };
        const reviews = await Review.find(filter)
            .skip(skip)
            .limit(limit)
            .populate("user", "name image")
            .populate("movie")
            .populate("theater");

        reviews.forEach((rev, i) => (reviews[i] = rev.transform()));

        return res.status(200).json(reviews);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

const createReview = async (req, res) => {
    const { text, rating, movieId, theaterId } = req.body;
    const { id: userId } = req.user;
    const errors = {};
    console.log(req.body);
    if (!text) errors.text = "text is required";
    if (!rating) errors.rating = "rating is required";
    if (!movieId && !theaterId) errors.id = "movieId or theaterId is required";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    if (typeof text != "string") errors.text = "text is invalid";
    if (typeof rating != "number" || rating > 5 || rating < 0 || !isInt(rating + ""))
        errors.rating = "rating is invalid";
    if (movieId && !ObjectId.isValid(movieId)) errors.movieId = "movieId is invalid";
    if (theaterId && !ObjectId.isValid(theaterId)) errors.theaterId = "theaterId is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        const newReview = new Review({
            text,
            rating,
            movie: movieId,
            theater: theaterId,
            user: userId,
        });
        await newReview.save();

        return res.status(201).json(newReview.transform());
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

module.exports = { getReviews, createReview };
