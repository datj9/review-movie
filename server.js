const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const { User } = require("./models/User");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;

nextApp.prepare().then(() => {
    const server = express();
    const passportSetup = require("./config/passport-setup");

    mongoose.connect(
        MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
        () => console.log("Connected to MongoDB")
    );

    server.use(express.json({ extended: true, limit: "10mb" }));
    server.use(bodyParser.urlencoded({ extended: true }));

    server.use(
        session({
            secret: COOKIE_PASSWORD, //pick a random string to make the hash that is generated secure
            resave: false, //required
            saveUninitialized: false, //required
        })
    );
    // initalize passport
    server.use(passport.initialize());
    // deserialize and serialize cookie from the browser
    server.use(passport.session());

    server.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));
    server.get(
        "/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/login", successRedirect: "/" })
    );

    server.get("/auth/facebook", passport.authenticate("facebook"));
    server.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/login" })
    );

    server.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    server.post("/register", async (req, res) => {
        const { username, password } = req.body;
        console.log(req.body);
        try {
            const newUser = new User({
                username,
                password,
            });
            await newUser.save();

            passport.authenticate("local")(req, res, function () {
                return res.status(201).json({});
            });
        } catch (error) {
            console.log(error);
        }
    });

    server.all("*", (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
