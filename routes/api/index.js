const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/movies", require("./movie"));

module.exports = router;
