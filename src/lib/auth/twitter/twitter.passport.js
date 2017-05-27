import passport from 'passport';
import {Strategy as TwitterStrategy} from 'passport-twitter';

export function setup(User, config) {

  passport.use(new TwitterStrategy({
    consumerKey: config.oAuth.twitter.clientID,
    consumerSecret: config.oAuth.twitter.clientSecret,
    callbackURL: config.oAuth.twitter.callbackURL
  }, (token, tokenSecret, profile, done) => {

    User.findOne({provider: 'twitter', 'social.id': profile.id}).exec().then(user => {

      if (!user) {
        user = new User({
          name: profile.displayName,
          username: profile.username,
          provider: 'twitter',
          photo: profile._json.profile_image_url,
          'social.id': profile.id,
          'social.info': profile._json
        });
      } else {
        user.social.info = profile._json;
        user.photo = profile._json.profile_image_url;
        user.last_login = Date.now();
      }

      user.save().then(user => done(null, user)).catch(err => done(err));

    }).catch(err => done(err));

  }));
}
