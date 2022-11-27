const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        const isMatch = await user.matchPassword(password);
        if (!user || !isMatch) {
          return done(null, false, {
            errors: { 'email or password': 'is invalid' },
          });
        }

        return done(null, user);
      } catch (err) {
        done(null);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: 'secrect key',
    },
    async function (jwt_payload, done) {
      try {
        console.log(jwt_payload);

        const user = await User.findOne({ email: jwt_payload.email });
        console.log(user.TokenCode);

        if (user && user.TokenCode == jwt_payload.code) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '1043053836697-q5sku2jln8bohhqm2oqu25auha4als3u.apps.googleusercontent.com', //GOOGLE_CLIENT_ID,
      clientSecret: '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',
      callbackURL: 'http://localhost:5001/user/google/callback',
    },
    function (accessToken, refreshToken, profile, callback) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return callback(err, user);
      // });
      return callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
