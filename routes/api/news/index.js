const router = require("express").Router();
const newsController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");
const { uploadSingle } = require("../../../middlewares/upload");

router.get("/", newsController.getNews);
router.post("/", authenticate, authorize(["admin"]), newsController.createNews);
router.post("/upload-image", uploadSingle("image"));

module.exports = router;
