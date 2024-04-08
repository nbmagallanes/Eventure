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
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "Forbidden";
        err.status = 403;
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

// Change the status of an attendance for an event by id
router.put('/', [requireAuth], async (req, res, next) => {

    const { userId, status } = req.body

    const event = await Event.findByPk(req.params.eventId, {
        include: { model: Group }
    });

    if (!event) {
      const err = new Error("Event not found");
      err.message = "Event couldn't be found";
      err.status = 404;
      return next(err)
    };

    const user = await User.findByPk(userId);

    if (!user) {
        const err = new Error("User not found");
        err.message = "User couldn't be found";
        err.status = 404;
        return next(err)
    };

    const coHost = await Membership.findOne({
        where: { 
            userId: req.user.id,
            groupId: event.Group.id,
            status: "co-host"
        }
    });

    if (req.user.id !== event.Group.organizerId && !coHost) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "Forbidden";
        err.status = 403;
        return next(err);
    };

    if (status === "pending") {
        const err = new Error("Status change error");
        err.message = "Cannot change an attendance status to pending";
        err.status = 400;
        return next(err);
    }

    const attendance = await Attendance.findOne({
        where: { userId: userId, eventId: parseInt(req.params.eventId) }
    })

    if (!attendance) {
        const err = new Error("Attendance Error");
        err.title = "Attendance Error";
        err.message = "Attendance between the user and the event does not exist";
        err.status = 404;
        return next(err);
    };

    const updateAttendance = await attendance.update({
        userId,
        status,
    });

    const payload ={
        id: updateAttendance.id,
        eventId: updateAttendance.eventId,
        userId: updateAttendance.userId,
        status: updateAttendance.status
    };

    res.json(payload);
});

// Delete attendance by id
router.delete('/:userId', requireAuth, async (req, res, next) => {

    const event = await Event.findByPk(req.params.eventId, {
        include: { model: Group }
    });

    if (!event) {
      const err = new Error("Event not found");
      err.message = "Event couldn't be found";
      err.status = 404;
      return next(err)
    };

    const user = await User.findByPk(req.params.userId);

    if (!user) {
        const err = new Error("User not found");
        err.message = "User couldn't be found";
        err.status = 404;
        return next(err)
    };

    if (req.user.id !== event.Group.organizerId && req.user.id !== parseInt(req.params.userId)) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "Forbidden";
        err.status = 403;
        return next(err);
    };

    const attendance = await Attendance.findOne({
        where: { userId: user.id, eventId: event.id }
    })

    if (!attendance) {
        const err = new Error("Attendance not found");
        err.message = "Attendance does not exist for this User";
        err.status = 404;
        return next(err)
    };

    await attendance.destroy();

    res.json({
        "message": "Successfully deleted attendance from event"
    });
})

module.exports = router;