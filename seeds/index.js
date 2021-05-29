const mongoose = require('mongoose');
const CampGround = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seed')

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database Connection open')
    })
    .catch((err => {
        console.log(err)
    }));

const RandArray = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}
const seedDB = async () => {
    await CampGround.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50)
        const camp = new CampGround({
            // your user id
            author: "6091a2d8729d8393b9216e4a",
            location: `${cities[i].city}, ${cities[i].state}`,
            title: `${cities[i].title}`,

            description: cities[i].description,
            price:cities[i].price,
            image: [
                cities[i].image
            ],
            geometry:{
                type:"Point",
                coordinates:[cities[i].longitude,cities[i].latitude]
            }



        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
