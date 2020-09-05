const router = require("express").Router();
const reviewController = require("./controller");
const { authenticate } = require("../../../middlewares/auth");

router.get("/", reviewController.getReviews);
router.post("/", authenticate, reviewController.createReview);

module.exports = router;
