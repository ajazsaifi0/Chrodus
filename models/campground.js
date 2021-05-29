const mongoose = require('mongoose');
const Review = require('./review')
const schema = mongoose.Schema;
const User = require('./user');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})
// include virtuals to json
const opts={toJSON:{virtuals:true}};

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', 'upload/c_fill,h_300,w_150');
})
const campgroundSchema = new schema({
    title: String,
    image: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            // required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts);
// add tag on cluster map
campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a style="text-decoration:none;" href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,35)}...</p>`
})
// middleware for delete all data related to a campground
campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('CampGround', campgroundSchema);
