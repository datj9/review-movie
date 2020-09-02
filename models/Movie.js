const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
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
        required: true,
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
});

MovieSchema.methods = {
    transform: function () {
        const Movie = this.toObject();

        Movie.id = Movie._id;
        delete Movie._id;
        delete Movie.__v;
        delete Movie.password;

        return Movie;
    },
};

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = { Movie, MovieSchema };
