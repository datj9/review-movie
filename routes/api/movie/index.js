const router = require("express").Router();
const movieController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");
// const { uploadSingle } = require("../../../middlewares/upload");

router.get("/", movieController.getMovies);
router.get("/crawl-movies", authenticate, authorize(["admin"]), movieController.createMoviesFromCrawling);
router.get("/:movieId", movieController.getMovieById);
router.post("/", movieController.createMovie);
// router.post("/upload-image", uploadSingle("image"));

module.exports = router;
