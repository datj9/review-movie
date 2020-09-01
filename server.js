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

    server.use("/api", require("./routes/api"));

    server.all("*", (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
