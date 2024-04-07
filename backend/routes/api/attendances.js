const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router({mergeParams: true});

// Request to attend an event by event id
router.post('/', [requireAuth], async (req, res, next) => {

    const event = await Event.findByPk(req.params.eventId);

    if (!event) {
      const err = new Error("Event not found");
      err.message = "Event couldn't be found";
      err.status = 404;
      return next(err)
    };

    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId,
            status: {
                [Op.or]: ["co-host", "member"]
            },
        }
    });

    if (!membership) {
        const err = new Error("Not a member");
        err.message = "Must be a member of this group to request to attend this event";
        err.status = 404;
        return next(err);
    };

    const attendance = await Attendance.findOne({
        where: {
            userId: req.user.id,
            eventId: parseInt(req.params.eventId)
        }
    })

    let newAttendance;
    if (!attendance) {
        newAttendance = await Attendance.create({
            userId: req.user.id,
            eventId: parseInt(req.params.eventId),
            status: "pending"
        });
    } else if (attendance.status === "pending") {
        const err = new Error("Attendance request error");
        err.message = "Attendance has already been requested";
        err.status = 400;
        return next(err);
    } else if (attendance.status === "attending") {
        const err = new Error("Attendance error");
        err.message = "User is already an attendee of the event";
        err.status = 400;
        return next(err);
    };

    const payload = {
        userId: newAttendance.userId,
        status: newAttendance.status
    };

    res.json(payload)
});

module.exports = router;