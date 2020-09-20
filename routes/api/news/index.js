const router = require("express").Router();
const newsController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.get("/", newsController.getNews);
router.post("/", authenticate, authorize(["admin"]), newsController.createNews);

module.exports = router;
