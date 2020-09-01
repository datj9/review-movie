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
router.post("/login", passport.authenticate("local"), function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    return res.status(200).json({});
});

router.get("/logout", authController.logOut);

module.exports = router;
