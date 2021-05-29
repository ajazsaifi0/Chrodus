// accessing dotenv
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// mongodb+srv://ajaz03:<password>@cluster0.fc2fo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const express = require('express')
const app = express();
// for our view directory
const path = require('path');
// for our mongoose
const mongoose = require('mongoose');
// for oue mongoose model
// for requiring review model
// for method over riding
const methodOverride = require('method-override')
// for boilerplate lay out
const ejsMate = require('ejs-mate')
// for error template
const expressError = require('./utils/expressError')
// for joi error function
// requiring campground router
const campgrounds = require('./routes/campground')
// requiring review router
const review = require('./routes/review');
const userRoutes = require('./routes/users');
// for flash
const flash = require('connect-flash');
// for passport
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
// mongoose sanitize
const mongoSanitize=require('express-mongo-sanitize');
// requiring helmet
const helmet=require('helmet');






// for session
const session = require('express-session');
// require connect-mongo

const MongoStore=require('connect-mongo');
// for connecting to mongoose 
const DbURL=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(DbURL,
     { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Database Connection open')
    })
    .catch((err => {
        console.log(err)
    }))


app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// for parsing url
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(helmet({contentSecurityPolicy:false})); 
// for using public directories
// session starter
const secret=process.env.SECRET || 'Ajazsaifi0@';
const store=MongoStore.create({
    mongoUrl:DbURL,
    crypto:{
    secret
    },
    touchAfter:24*3600
});
store.on("error",function (e) {
    console.log("session store error",e)
    
})
const sessionConfig = {
    store:store,
    name:"FUCKOFF",
    secret,
    resave: false,
    saveUninitialized: true,
    // cookie which sends during the session
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

// flash middleware
app.use(flash());



app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {

    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// make a user
app.use('/', userRoutes);



// this represents all our /campgrounds routes
app.use('/campgrounds', campgrounds);
// for joi validation


app.use('/', review);


app.get('/', (req, res) => {
    res.render('home')
})






// error handler

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No,Something Went Wrong'
    res.status(statusCode).render('error', { err })

})






const port=process.env.PORT||3000;
// launching our server
app.listen(port, () => {
    console.log(`server started on port ${port} `);
})