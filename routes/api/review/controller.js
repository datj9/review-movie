const { Review } = require("../../../models/Review");
const { Movie } = require("../../../models/Movie");
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
        if (movieId) {
            const foundMovie = await Movie.findById(movieId);
            if (!foundMovie) return res.status(404).json({ error: "Movie not found" });

            const filter = { movie: movieId };
            const reviews = await Review.find(filter)
                .skip(skip)
                .limit(limit)
                .populate("user", "name image")
                .populate("movie");
            const totalReviews = await Review.countDocuments(filter);

            reviews.forEach((rev, i) => (reviews[i] = rev.transform()));
            if (foundMovie.averageRating) {
                foundMovie.roundedRating = Math.round(foundMovie.averageRating * 10) / 10;
            }
            return res.status(200).json({ movie: foundMovie, reviews, total: totalReviews });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

const createReview = async (req, res) => {
    const { text, rating, movieId, theaterId } = req.body;
    const { id: userId } = req.user;
    const errors = {};

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
        if (movieId) {
            const foundMovie = await Movie.findById(movieId);
            if (!foundMovie) return res.status(404).json({ error: "Movie not found" });

            const newReview = new Review({
                text,
                rating,
                movie: movieId,
                user: userId,
            });
            const totalReviews = await Review.countDocuments({ movie: movieId });
            const sumRatingOfAllReviews = foundMovie.averageRating ? totalReviews * foundMovie.averageRating : 0;
            await newReview.save();
            const newAverageRating = (sumRatingOfAllReviews + rating) / (totalReviews + 1);
            await Movie.updateOne({ _id: movieId }, { averageRating: newAverageRating });

            return res.status(201).json(newReview.transform());
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

module.exports = { getReviews, createReview };
