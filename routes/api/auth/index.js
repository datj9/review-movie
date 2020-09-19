const router = require("express").Router();
const passport = require("passport");
const authController = require("./controller");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", successRedirect: "/" }));

router.get("/facebook", passport.authenticate("facebook"));
router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/login" })
);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logOut);

router.post("/send-email", authController.sendEmailToRecoverAccount);
router.post("/verify-token", authController.checkVerifyToken);
router.post("/change-password-by-email", authController.changePasswordByVerifyingEmail);

module.exports = router;
