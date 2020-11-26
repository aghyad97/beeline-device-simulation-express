const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const User = require('./models/user');
const Angle = require('./models/angle');
const mongoose = require('mongoose');
const path = require('path');
const mqtt = require("mqtt");
const angle = require('./models/angle');
const mqttClient = mqtt.connect('mqtt://localhost:1883');
mongoose.connect('mongodb://127.0.0.1:27017/beeline', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// invoke an instance of express application.
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// set our application port
app.set('port', 9000);
app.set('view engine', 'ejs');
// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({
    extended: true
}));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'COE457labSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 24 * 60 * 60 * 1000 * 30 // 24 hours * 30 = 30 days
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('login');
});


// route for user signup
app.route('/register')
    .get(sessionChecker, (req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            .then(user => {
                console.log(user);
                req.session.user = user.dataValues;

                res.redirect('/');
            })
            .catch(error => {
                res.redirect('/register');
            });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        var email = req.body.email,
            password = req.body.password;

        User.findOne({
            email: email
        }).then(function (user) {
            if (!user) {
                console.log(user);
                console.log('login failed');
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                console.log('password not matching');
                res.redirect('/login');
            } else {
                console.log('dashboard');
                req.session.user = user._id;
                res.render('dashboard', {
                    name: user.name
                });
            }
        });
    });


// route for user's dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard');
    } else {
        res.render('login');
    }
});

app.get('/arrow', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('direction');
    } else {
        res.render('login');
    }
});


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

mqttClient.on('connect', function () {
    // subscribing to topic to get the coordinates
    // Subscribes with QoS 0 (0 is default)
    mqttClient.subscribe('coordinates', function (err) {
        if (!err) {
            console.log('Subscribed to coordinates topic');
        } else {
            console.log(err);
        }
    });
})

mqttClient.on('message', function (topic, message) {
    if (topic === 'coordinates') {
        // make sure the topic is correct
        var messageJson = JSON.parse(message.toString());
        console.log(messageJson);
        angle.create({angle: messageJson}).then(function (params) {
            console.log(params._id);
        });
        // do stuff with the accJSON
    }
})

// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));