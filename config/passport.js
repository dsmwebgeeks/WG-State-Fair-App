/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

if(process.env.CALLBACK_URL) {
  callback_url = process.env.CALLBACK_URL;
} else {
  callback_url = 'http://localhost:1337/auth/twitter/callback';
}

module.exports.passport = {

  // local: {
  //   strategy: require('passport-local').Strategy
  // },

  twitter: {
    name: 'Twitter',
    protocol: 'oauth',
    strategy: require('passport-twitter').Strategy,
    options: {
      consumerKey: 'KDHGU6MxpD9hozN5chLkwlTKO',
      consumerSecret: 'rI0BWzIHZYzqEAhJ4VhJxHTdCI7tVJCtbPRyhzMr3IqOKDYOy2',
      callbackURL: callback_url
    }
  // },

  // github: {
  //   name: 'GitHub',
  //   protocol: 'oauth2',
  //   strategy: require('passport-github').Strategy,
  //   options: {
  //     clientID: 'your-client-id',
  //     clientSecret: 'your-client-secret'
  //   }
  // },

  // facebook: {
  //   name: 'Facebook',
  //   protocol: 'oauth2',
  //   strategy: require('passport-facebook').Strategy,
  //   options: {
  //     clientID: 'your-client-id',
  //     clientSecret: 'your-client-secret'
  //   }
  // },

  // google: {
  //   name: 'Google',
  //   protocol: 'openid',
  //   strategy: require('passport-google').Strategy
  }

};
