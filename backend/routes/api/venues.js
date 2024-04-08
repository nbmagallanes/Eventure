const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, Venue } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90})
        .withMessage("Latitude must be within -90 and 90"),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180})
        .withMessage("Longitude must be within -180 and 180"),
    handleValidationErrors
];

// return error is there is no group (no venue, no group) and incorrect status
const editVenueAuth = async (req, res, next) => {

    const group = await Group.findOne({
        include: {
            model: Venue,
            where: { id: req.params.venueId }
        }
    });

    if (!group) {
        const err = new Error("Venue not found");
        err.message = "Venue couldn't be found";
        err.status = 404;
        return next(err);
    };

    const membership = await Membership.findOne({
        where: {
         userId: req.user.id,
         groupId: group.id
        }
    });

    if (req.user.id !== group.organizerId && (!membership || membership.status !== "co-host")) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "You are not authorized to make this request";
        err.status = 403;
        return next(err);
    };

    return next();
};

// Edit venue by id 
router.put('/:venueId', [requireAuth, editVenueAuth, validateVenue], async (req, res, next) => {

    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(req.params.venueId);

    const updatedVenue = await venue.update({
        address, 
        city, 
        state, 
        lat, 
        lng 
    });

    res.json(updatedVenue)
});

module.exports = router;