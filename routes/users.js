const express = require('express');
const passport = require('passport');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const users = require('../controllers/users');
// for registring the user
router.route('/register')
    .get(users.RegisterForm)
    .post(wrapAsync(users.RegisterFormPost))
router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginFormPost)

// router.get('/register', users.RegisterForm);

// router.post('/register', wrapAsync(users.RegisterFormPost));
// for login a user
// router.get('/login', users.loginForm);
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginFormPost);
// for log out
router.get('/logout', users.Logout);


module.exports = router;

