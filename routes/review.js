const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');


const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../controllers/reviews');







router.post('/campgrounds/:id/reviews', isLoggedIn, validateReview, wrapAsync(review.createReview));
// for deleting reviews
router.delete('/campgrounds/:id/reviews/:reviewid', isLoggedIn, isReviewAuthor, wrapAsync(review.Destroy));
module.exports = router;