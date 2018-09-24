var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Join
router.get('/Join', function (req, res) {
	res.render('join');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Dashboard
router.get('/Dashboard', ensureAuthenticated , function (req, res) {
	res.render('dashboard');
});
 
// My Account
router.get('/My-Account', ensureAuthenticated ,function (req, res) {
	res.render('account');
});

// auth with google
router.get('/google',passport.authenticate('google'));


// Register User
router.post('/Join', function (req, res) {
	var FirstName = req.body.FirstName;
	var LastName = req.body.LastName;
	var email = req.body.email;
	
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('FirstName', 'First Name is required').notEmpty();
	req.checkBody('LastName', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('join', {
			errors: errors
		});
	}
	else {
		//checking for email already taken
		User.findOne({ email: { 
			"$regex": "^" + email + "\\b", "$options": "i"
	}}, function (err, mail) {
			if ( mail) {
				res.render('join', {
					
					mail: mail
				});
			}
			else {
				var newUser = new User({
					FirstName: FirstName,
					LastName: LastName,
					email: email,
				   
					password: password
				});
				User.createUser(newUser, function (err, user) {
					if (err) throw err;
					console.log(user);
				});
		 req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/users/login');
			}
	   });
	}
});

// Local strategy

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
	function (email, password, done) {
		User.getUserByEmail(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

// Google strategy

passport.use(new GoogleStrategy({
    clientID: '876259512398-21jj25hl6r2ujnbf0etvmogj01u3lcu2.apps.googleusercontent.com',
    clientSecret: 'a-bTkzm1Tg0tb5AZYT8KgaJP',
    callbackURL: "/users/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

router.get('/users/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/users/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/dashboard');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


module.exports = router;