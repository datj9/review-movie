const router = require("express").Router();
const newsController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");
const { uploadSingle } = require("../../../middlewares/upload");

router.get("/", newsController.getNews);
router.get("/:newsId", newsController.getNewsById);
router.post("/", authenticate, authorize(["admin"]), newsController.createNews);
router.post("/upload-image", authenticate, authorize(["admin"]), uploadSingle("image"));
router.put("/:newsId", authenticate, authorize(["admin"]), newsController.updateNews);
router.patch("/change-public-status/:newsId", authenticate, authorize(["admin"]), newsController.changePublicStatus);
router.delete("/:newsId", authenticate, authorize(["admin"]), newsController.deleteNewsById);

module.exports = router;
