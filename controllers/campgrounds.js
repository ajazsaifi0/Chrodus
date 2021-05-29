const CampGround = require('../models/campground')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxtoken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxtoken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const s = await CampGround.find({})
    res.render('campgrounds/index', { s });
}
module.exports.renderNewForm = (req, res) => {

    return res.render('campgrounds/new')

}
module.exports.renderNewFormPost = async (req, res, next) => {
    // if (!req.body.campground) throw new expressError('invalid data', 400)
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()


    const newData = new CampGround(req.body.campground);
    newData.geometry = geodata.body.features[0].geometry;
    
    newData.image = req.files.map(f => ({ url: f.path, filename: f.filename }));

    newData.author = req.user._id;
    await newData.save();

    req.flash('success', 'Successfully made a new CampGround');

    res.redirect(`/campgrounds/${newData._id}`)


}

module.exports.showpage = async (req, res) => {
    const f = await CampGround.findById(req.params.id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }
    }).populate('author');


    if (!f) {
        req.flash('error', 'Cannot find Campground');
        res.redirect('/campgrounds')
    }
   
    // console.log(f.geometry.coordinates);
    res.render("campgrounds/show", { f });
}
module.exports.updateGet = async (req, res) => {
    const { id } = req.params;
    const e = await CampGround.findById(id)

    if (!e) {
        req.flash('error', 'Cannot find Campground');
        res.redirect('/campgrounds')
    }
    // const campground = await CampGround.findById(id);

    res.render("campgrounds/edit", { e });
}
module.exports.updatePut = async (req, res, next) => {

    const { id } = req.params;

    // for preventing to edit someone else campground

    const c = await CampGround.findByIdAndUpdate(id, { ...req.body.campground }, { new: true, useFindAndModify: false })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    c.image.push(...images);

    await c.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await c.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });

    }
    req.flash('success', 'Successfully Updated Campground');
    res.redirect(`/campgrounds/${c._id}`);


}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id)
    req.flash('error', 'You campground is deleted')
    res.redirect('/campgrounds');

}