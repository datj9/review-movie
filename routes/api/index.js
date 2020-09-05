const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/movies", require("./movie"));
router.use("/reviews", require("./review"));

module.exports = router;
