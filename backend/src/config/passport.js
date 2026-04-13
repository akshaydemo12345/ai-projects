const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️ Google OAuth credentials missing. Authentication through Google will not be available.');
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id, displayName, emails, photos } = profile;
          const email = emails[0].value;

          // 1. Check if user exists
          let user = await User.findOne({ googleId: id });
          
          if (!user) {
            // 2. Check if email already used
            user = await User.findOne({ email });
            if (user) {
              user.googleId = id;
              user.avatar = photos[0].value;
              await user.save();
            } else {
              // 3. Create new user
              user = await User.create({
                name: displayName,
                email,
                googleId: id,
                avatar: photos[0].value,
                isEmailVerified: true,
              });
            }
          }
          
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
