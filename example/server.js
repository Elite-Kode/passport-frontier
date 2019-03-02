var express = require('express')
    , session = require('express-session')
    , passport = require('passport')
    , Strategy = require('../lib').Strategy
    , app = express();

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

let scopes = ['auth', 'capi'];

passport.use(new Strategy({
    clientID: '',
    clientSecret: '',
    callbackURL: 'http://localhost:5000/callback',
    scope: scopes
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/', passport.authenticate('frontier', {scope: scopes}), function (req, res) {
});
app.get('/callback',
    passport.authenticate('frontier', {failureRedirect: '/'}), function (req, res) {
        res.redirect('/info')
    } // auth success
);
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/info', checkAuth, function (req, res) {
    //console.log(req.user)
    res.json(req.user);
});


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('Not logged in');
}


app.listen(5000, function (err) {
    if (err) return console.log(err);
    console.log('Listening at http://localhost:5000/');
});
