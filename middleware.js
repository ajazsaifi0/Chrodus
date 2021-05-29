const CampGround = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema, reviewSchema } = require('./joiSchema');
const expressError = require('./utils/expressError')

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.flash('error', 'you must be login first ');
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400)

    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have a permission of doing this');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400)
    }
    else {
        next();
    }
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have a permission of doing this');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
