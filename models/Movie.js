const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        runningTime: {
            type: Number, // minute,
        },
        releaseDate: {
            type: Date,
        },
        filmDirectors: {
            type: [String],
            required: true,
        },
        actors: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        trailer: {
            type: String,
        },
        status: {
            type: Number,
            required: true,
            // 0: crawled commingSoon
            // 1: crawled nowShowing
            // 2: commingSoon
            // 3: nowShowing
        },
        averageRating: {
            type: Number,
        },
    },
    { timestamps: true }
);

MovieSchema.methods = {
    transform: function () {
        const movie = this.toObject();

        movie.id = movie._id;
        delete movie._id;
        delete movie.__v;

        return movie;
    },
};

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = { Movie, MovieSchema };
