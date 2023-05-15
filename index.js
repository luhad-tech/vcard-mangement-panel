const express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , bodyParser = require('body-parser')
  , Strategy = require('passport-discord').Strategy
  , app      = express();

require('dotenv').config();
app.set('view engine', 'pug')

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];
const prompt = 'consent'

passport.use(new Strategy({
    clientID: '1107366220321263758',
    clientSecret: '_nqYsi000YNfNq6SF82zItCj_uQlL-Eb',
    callbackURL: 'http://localhost:5000/callback',
    scope: scopes,
    prompt: prompt
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
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
app.use(bodyParser.urlencoded({ extended: true }));

// passport.authenticate('discord', { scope: scopes, prompt: prompt })
app.get('/', checkAuth, checkTeamMember, function(req, res) {
    res.render('index')
});

app.get('/login', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function (req, res) {})

app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/login_failed' }), function(req, res) { res.redirect('/') } // auth success
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.post('/cards', function(req, res) {
   console.log(req.body)
});
app.get('/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login')
}

function checkTeamMember (req, res, next) {
    switch (req.user.id) {
        case '308104209931173890':
            next()
            break;
        case '512381446825050147':
            next()
            break;
        case '282952731520532480':
            next()
            break;
    
        default:
            res.status(401).send('unauthorized')
            break;
    }
}


app.listen(5000, function (err) {
    if (err) return console.log(err)
    console.log('Listening at http://localhost:5000/')
})