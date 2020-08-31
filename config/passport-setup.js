const passport = require("passport"),
    { Strategy: GoogleStrategy } = require("passport-google-oauth20"),
    FacebookStrategy = require("passport-facebook").Strategy,
    { User } = require("../models/User"),
    GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((e) => {
            done(new Error("Failed to deserialize an user"));
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "https://reviewphim.herokuapp.com/auth/google/callback",
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
            callbackURL: "https://reviewphim.herokuapp.com/auth/facebook/callback",
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                const user = await User.findOne({ facebookId: profile.id });

                if (user) return done(null, user);

                const newUser = new User({
                    facebookId: profile.id,
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
