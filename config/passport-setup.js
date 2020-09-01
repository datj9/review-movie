const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    GoogleStrategy = require("passport-google-oauth20").Strategy,
    FacebookStrategy = require("passport-facebook").Strategy,
    GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET,
    GG_CALLBACK_URL = process.env.GG_CALLBACK_URL,
    FB_CALLBACK_URL = process.env.FB_CALLBACK_URL,
    { User } = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user.transform());
        })
        .catch((e) => {
            done(new Error("Failed to deserialize an user"));
        });
});

passport.use(
    new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            if (!user.validatePassword(password, user.password)) {
                return done(null, false, { message: "Incorrect password." });
            }

            return done(null, user);
        });
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GG_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                const user = await User.findOne({ googleId: profile.id });

                if (user) return done(null, user);
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    image: profile._json.picture,
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: FB_CALLBACK_URL,
            profileFields: ["id", "displayName", "picture", "email"],
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                const user = await User.findOne({ facebookId: profile.id });

                if (user) return done(null, user);
                console.log(profile);
                const newUser = new User({
                    facebookId: profile.id,
                    name: profile.displayName,
                    image: profile._json.picture ? profile._json.picture.data.url : null,
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);
