# passport-frontier

Passport strategy for authentication with [Frontier Store](https://www.frontierstore.net/) through the OAuth 2.0 API.

The official docs page found [here](https://user.frontierstore.net/developer/docs) details how OAuth2 is set up for Frontier. (Requires Frontier account to access)

## Usage
`npm install passport-frontier --save`

#### Configure Strategy
The Frontier authentication strategy authenticates users via a Frontier Store user account and OAuth 2.0 token(s). A Frontier API client ID, secret and redirect URL must be supplied when using this strategy. The strategy also requires a `verify` callback, which receives the access token and an optional refresh token, as well as a `profile` which contains the authenticated Frontier user's profile. The `verify` callback must also call `cb` providing a user to complete the authentication.

```javascript
let FrontierStrategy = require('passport-frontier').Strategy;

let scopes = ['auth', 'capi'];

passport.use(new FrontierStrategy({
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'callbackURL',
    scope: scopes
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ frontierId: profile.id }, function(err, user) {
        return cb(err, user);
    });
}));
```

#### Authentication Requests
Use `passport.authenticate()`, and specify the `'frontier'` strategy to authenticate requests.

For example, as a route middleware in an Express app:

```javascript
app.get('/auth/frontier', passport.authenticate('frontier'));
app.get('/auth/frontier/callback', passport.authenticate('frontier', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/secretstuff') // Successful auth
});
```


## Examples
An Express server example can be found in the `/example` directory. Be sure to `npm install` in that directory to get the dependencies.

## Credits
* [Nicholas Tay](https://github.com/nicholastay) - used [passport-discord](https://github.com/nicholastay/passport-discord) to understand passport more and use as a base.

## License
Licensed under the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).
