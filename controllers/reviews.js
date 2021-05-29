const CampGround = require('../models/campground');
const Review = require('../models/review');
const expressError = require('../utils/expressError');
module.exports.createReview = async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review)
    await campground.save();
    await review.save();
    req.flash('success', 'Thank you for your review')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.Destroy = async (req, res) => {
    const { id, reviewid } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash('error', 'Your review is deleted')
    res.redirect(`/campgrounds/${id}`);

}