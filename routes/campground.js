const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
// representing controllers
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

// const passport = require('passport');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
// using single route for multiple paths
router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.renderNewFormPost))
// for index page




// for adding new data
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
// for adding data 
router.route('/:id')
    .get(wrapAsync(campgrounds.showpage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updatePut))
    .delete(isAuthor, wrapAsync(campgrounds.deleteCampground))


// for delete
// router.delete('/:id', isAuthor, wrapAsync(campgrounds.deleteCampground))

// for showing details
// router.get('/:id', wrapAsync(campgrounds.showpage))
// for updating
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.updateGet))
// router.put('/:id', validateCampground, isLoggedIn, isAuthor, wrapAsync(campgrounds.updatePut));
module.exports = router;

