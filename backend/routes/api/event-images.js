const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {

    const image = await EventImage.findByPk(req.params.imageId);

    if (!image) {
        const err = new Error("Image not found");
        err.message = "Event image couldnt be found";
        err.status = 404;
        return next(err);
    };

    console.log(image.eventId)

    const event = await Event.findOne({
        where: { id: image.eventId },
        include: { model: Group }
    });

    const coHost = await Membership.findOne({
        where: { 
            userId: req.user.id,
            groupId: event.groupId,
            status: "co-host"
        }
    });

    if (req.user.id !== event.Group.organizerId && !coHost) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "You are not authorized to make this request";
        err.status = 403;
        return next(err);
    };

    image.destroy();

    res.json({
        "message": "Successfully deleted"
    })
});

module.exports = router;