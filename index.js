const express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , bodyParser = require('body-parser')
  , Strategy = require('passport-discord').Strategy
  , app      = express()
  , cors = require('cors')
  , uuid = require('uuid');

require('dotenv').config();
app.set('view engine', 'pug')

app.use(cors());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const { Pool, Client } = require('pg')
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`

const pool = new Pool({
  connectionString,
})
// {street: null, city: null, state: null, code: null, country: null}
 async function query(data) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO public.vcf_cards (uuid, email, firstname, lastname, middlename, organization, photo, w_phone, title, url, workurl, note, nickname, prefix, suffix, gender, role, h_phone, c_phone, p_phone, h_fax, w_fax, h_email, w_email, alias, h_address, w_address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)'
    await client.query(queryText, [uuid.v4(), data.email, data.fname, data.lname, data.mname, data.org, data.photo, data.w_phone, data.title, data.url, data.workurl, data.note, data.nickname, data.prefix, data.suffix, data.gender, data.role, data.h_phone, data.c_phone, data.p_phone, data.h_fax, [null], ['hderifield2005@outlook.com'], ['hayden@luhad.tech'], '/hayden', {street: null, city: null, state: null, code: null, country: null}, {street: null, city: null, state: null, code: null, country: null}])
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    console.log(e)
  } finally {
    client.release()
  }
 }
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
    secret: 'jammy whammies',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// passport.authenticate('discord', { scope: scopes, prompt: prompt })
app.get('/', checkAuth, checkTeamMember, function(req, res) {
    res.render('index')
});

app.get('/login', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function (req, res) {})

app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/login_failed' }), function(req, res) { res.redirect('/') } // auth success
);
app.get('/logout', function(req, res) {
    req.logout(err => {console.log(err)});
    res.redirect('/');
});
app.post('/cards', checkAuth, checkTeamMember, function(req, res) {
    console.log(req.body)
    res.send('sent!')
    console.log(req.body.org)
    // query(req.body);
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