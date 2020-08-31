const express = require("express"); // Sử dụng framework express
const next = require("next"); // Include module next
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const port = parseInt(process.env.PORT, 10) || 3000; // Port để chạy app Nextjs, cũng là server nodejs
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

app.prepare().then(() => {
    const server = express();
    const passportSetup = require("./config/passport-setup");

    mongoose.connect(
        MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
        () => console.log("Connected to MongoDB")
    );

    server.use(
        "/static",
        express.static(path.join(__dirname, "static"), {
            maxAge: dev ? "0" : "365d",
        })
    );
    server.use(
        session({
            secret: COOKIE_PASSWORD, //pick a random string to make the hash that is generated secure
            resave: false, //required
            saveUninitialized: false, //required
        })
    );
    // initalize passport
    server.use(passport.initialize());
    // deserialize cookie from the browser
    server.use(passport.session());

    server.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
    server.get(
        "/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/login", successRedirect: "/" })
    );

    server.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "default"] }));
    server.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/login" })
    );

    server.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
