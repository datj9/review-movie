const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

const url = require("url");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

if (!dev && cluster.isMaster) {
    console.log(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });
} else {
    const nextApp = next({ dir: ".", dev });
    const nextHandler = nextApp.getRequestHandler();
    const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
    const MONGODB_URI = process.env.MONGODB_URI;

    nextApp.prepare().then(() => {
        const server = express();

        if (!dev) {
            // Enforce SSL & HSTS in production
            server.use(function (req, res, next) {
                var proto = req.headers["x-forwarded-proto"];
                if (proto === "https") {
                    res.set({
                        "Strict-Transport-Security": "max-age=31557600", // one-year
                    });
                    return next();
                }
                res.redirect("https://" + req.headers.host + req.url);
            });
        }

        // Static files
        // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
        server.use(
            "/static",
            express.static(path.join(__dirname, "static"), {
                maxAge: dev ? "0" : "365d",
            })
        );

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

        // Default catch-all renders Next app
        server.get("*", (req, res) => {
            // res.set({
            //   'Cache-Control': 'public, max-age=3600'
            // });
            const parsedUrl = url.parse(req.url, true);
            nextHandler(req, res, parsedUrl);
        });

        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`Listening on http://localhost:${port}`);
        });
    });
}
// app.prepare().then(() => {
//     const server = express();

//     server.all("*", (req, res) => {
//         return handle(req, res);
//     });

//     server.listen(port, (err) => {
//         if (err) throw err;
//         console.log(`> Ready on http://localhost:${port}`);
//     });
// });
