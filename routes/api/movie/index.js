const router = require("express").Router();
const movieController = require("./controller");

// const { authenticate, authorize } = require("../../../middlewares/auth");
// const { uploadSingle } = require("../../../middlewares/upload");

const authCheck = (req, res, next) => {
    const { user } = req;

    if (!user) return res.status(401).json({});
    next();
};

const authorize = (req, res, next) => {
    const { user } = req;

    if (user.userType != "admin") return res.status(401).json({ error: "User is not allowed" });
    next();
};

router.get("/", movieController.getMovies);
router.post("/", movieController.createMovie);
router.get("/crawl-movies", authCheck, authorize, movieController.createMoviesFromCrawling);
// router.post("/upload-image", uploadSingle("image"));

module.exports = router;
