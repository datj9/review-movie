const { Movie } = require("../../../models/Movie");
const isInt = require("validator/lib/isInt");
const isURL = require("validator/lib/isURL");
const { crawlMovies } = require("../../../helpers/crawl");
const ObjectId = require("mongoose").Types.ObjectId;

const getMovies = async (req, res) => {
    const { pageSize, pageIndex, status } = req.query;
    const limit = isInt(pageSize + "") ? +pageSize : 10;
    const skip = isInt(pageIndex + "") ? (+pageIndex - 1) * limit : 0;
    let statusFilter;

    try {
        const parsedStatus = JSON.parse(status);

        if (Array.isArray(parsedStatus) && parsedStatus.length <= 4) {
            const statusArr = Array.from(new Set(parsedStatus));

            statusArr.forEach((ele, i) => {
                if (!isInt(ele + "")) {
                    return res.status(400).json({ status: "status is invalid" });
                }
                statusArr[i] = +ele;
            });

            statusFilter = statusArr;
        }
    } catch (error) {}

    try {
        if (statusFilter) {
            const promiseArr = [];
            statusFilter.forEach((status) =>
                promiseArr.push(
                    Movie.find({ status })
                        .skip(skip)
                        .limit(limit)
                        .sort([["createdAt", -1]])
                )
            );
            const foundMovies = await Promise.all(promiseArr);
            foundMovies.forEach((movieListByStatus, i) => {
                movieListByStatus.forEach((movie, j) => {
                    foundMovies[i][j] = movie.transform();
                });
            });
            const foundMoviesConvertedToObj = Object.assign({}, foundMovies);

            return res.status(200).json(foundMoviesConvertedToObj);
        } else {
            const movies = await Movie.find()
                .skip(skip)
                .limit(limit)
                .sort([["createdAt", -1]]);

            movies.forEach((movie, i) => (movies[i] = movie.transform()));

            return res.status(200).json(movies);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getMovieById = async (req, res) => {
    const { movieId } = req.params;

    if (!ObjectId.isValid(movieId)) return res.status(400).json({ error: "movieId is invalid" });

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ error: "Movie not found" });
        return res.status(200).json(movie.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

const createMovie = async (req, res) => {
    const { name, image, runningTime, filmDirectors, actors, description, trailer } = req.body;
    const validatedFields = ["name", "description", "filmDirectors", "actors", "trailer", "image", "runningTime"];
    const errors = {};

    validatedFields.forEach((field) => {
        if (!req.body[field]) errors[field] = `${field} is required`;
    });
    if (Object.keys(errors).length) return res.status(400).json(errors);

    // validate data type and valid data
    validatedFields.slice(0, 2).forEach((field) => {
        if (typeof req.body[field] != "string") errors[field] = `${field} is invalid`;
    });
    validatedFields.slice(2, 4).forEach((field) => {
        if (!Array.isArray(req.body[field])) errors[field] = `${field} must be an array`;
    });
    validatedFields.slice(4, 6).forEach((field) => {
        if (!isURL(req.body[field] + "")) errors[field] = `${field} must be URL`;
    });
    if (!isInt(runningTime + "")) errors.runningTime = "runningTime must be int";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    filmDirectors.forEach((director) => {
        if (typeof director != "string") errors.director = "director must be string";
    });
    actors.forEach((actor) => {
        if (typeof actor != "string") errors.actor = "actor must be string";
    });
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        const newMovie = new Movie({
            name,
            image,
            runningTime,
            filmDirectors,
            actors,
            description,
            trailer,
        });
        await newMovie.save();

        return res.status(201).json(newMovie.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

const createMoviesFromCrawling = async (req, res) => {
    try {
        const nowShowingMovies = await crawlMovies("dang-chieu");
        const commingSoonMovies = await crawlMovies("sap-chieu");
        const allCreatedMovies = nowShowingMovies.concat(commingSoonMovies);

        allCreatedMovies.forEach((movie, i) => (allCreatedMovies[i] = movie.transform()));

        return res.status(201).json(allCreatedMovies);
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { getMovies, getMovieById, createMovie, createMoviesFromCrawling };
