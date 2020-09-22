const router = require("express").Router();
const reviewController = require("./controller");
const { authenticate } = require("../../../middlewares/auth");

router.get("/", reviewController.getReviews);
router.get("/my-reviews", authenticate, reviewController.getReviewsByUserId);
router.post("/", authenticate, reviewController.createReview);

module.exports = router;
