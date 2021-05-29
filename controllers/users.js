const User = require('../models/user');
module.exports.RegisterForm = (req, res) => {
    res.render('users/register')
}
module.exports.RegisterFormPost = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ username, email })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome To CampGround');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }


}
module.exports.loginForm = (req, res) => {
    res.render('users/login');
}
module.exports.loginFormPost = async (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}
module.exports.Logout = (req, res) => {
    req.logout();
    req.flash('success', 'take care');
    res.redirect('login')
}