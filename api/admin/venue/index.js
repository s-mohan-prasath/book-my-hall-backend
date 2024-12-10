import express from 'express';
import passport from 'passport';
import { ValidateAddVenue, ValidateUpdateVenue } from '../../../validate/venue.validate.js';
import { venueImgDir } from '../../../config/multer.image.config.js';
import { ImageModel, VenueModel } from '../../../models/allModels.js';

const Router = express.Router();
/**
 * Route    /venue
 * Des       add venues
 * Params    none
 * Access    private
 * Method    POST
 */

//send multipart form data
Router.post('/', passport.authenticate("jwt", { session: false }), venueImgDir.array('venue-images', 5), async (req, res) => {
    try {
        const venueData = JSON.parse(req.body.venueData);
        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ status: 'failed', message: 'No image files were uploaded.' });
        }
        await ValidateAddVenue(venueData);
        const uploadedImages = req.files.map((file, i) => { return { url: file.filename, caption: "image_" + (i + 1) } });
        let image = await ImageModel.create({ images: uploadedImages })
        venueData.image = image._id
        const venue = await VenueModel.create(venueData);
        return res.json({
            status: 'success',
            message: 'Venue added successfully!',
            venue,
        });
    } catch (e) {
        // Handle errors
        return res.status(400).json({ status: 'failed', error: e.message });
    }
});
Router.patch('/:_id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.params
        const venueData = JSON.parse(req.body.venueData);
        await ValidateUpdateVenue(venueData)
        const venue = await VenueModel.updateOne({ _id: _id }, { venueData })
        return res.json({
            status: 'success',
            message: 'Venue Details Updated successfully!',
            venue,
        });
    } catch (e) {
        return res.status(400).json({ status: 'failed', error: e.message });
    }
});
Router.delete('/:_id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.params
        await VenueModel.deleteOne({ _id: _id })
        return res.json({
            status: 'success',
            message: 'Venue deleted successfully!'
        });
    } catch (e) {
        return res.status(400).json({ status: 'failed', error: e.message });
    }
});



export default Router;
