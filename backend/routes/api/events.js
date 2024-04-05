const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Group,
  Membership,
  Venue,
  Event,
  GroupImage,
  Attendance,
  EventImage,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

async function attendingTotal(events) {
  if (events.length) {
    for (let event of events) {
      const numAttending = await Attendance.count({
        where: { eventId: event.id },
      });
      event.dataValues.numAttending = numAttending;
    }
  } else {
    const numAttending = await Attendance.count({
      where: { eventId: events.id },
    });
    events.dataValues.numAttending = numAttending;
  }
}

async function eventsImagePreview(events) {
  for (let event of events) {
    const image = await EventImage.findOne({
      where: {
        eventId: event.id,
        preview: true,
      },
    });

    if (image) event.dataValues.previewImage = image.url;
    else event.dataValues.previewImage = null;
  }
}

async function eventAuth(req, res, next) {

    const event = await Event.findByPk(req.params.eventId, {
        include: { model: Group }
    });

    if (!event) {
        const err = new Error("Event not found");
        err.message = "Event couldn't be found";
        err.status = 404;
        return next(err);
    };

    const organizerId = event.Group.dataValues.organizerId;
    const groupId = event.Group.dataValues.id;

    const membership = await Membership.findOne({
        where: {
         userId: req.user.id,
         groupId: groupId
        }
    });

    const attendance = await Attendance.findOne({
        where: { userId: req.user.id }
    });

    if (((!membership) && req.user.id !== organizerId) || 
    (membership && membership.status !== "co-host" && attendance.status !== "attending")) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "You are not the organizer or co-host of this group";
        err.status = 403;
        return next(err);
    };

    return next();
};

// Get events
router.get("/", async (req, res, next) => {
  const events = await Event.findAll({
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "startDate",
      "endDate",
    ],
    include: [
      {
        model: Group,
        attributes: ["id", "name", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "city", "state"],
      },
    ],
  });

  await attendingTotal(events);
  await eventsImagePreview(events);

  res.json({ Events: events });
});

// Get details of event by id
router.get("/:eventId", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"],
      },
      {
        model: EventImage,
        attributes: ["id", "url", "preview"],
      },
    ],
  });

  if (!event) {
    const err = new Error("Event not found");
    err.message = "Event couldn't be found";
    err.status = 404;
    return next(err);
  }

  await attendingTotal(event);

  const {
    id,
    groupId,
    venueId,
    name,
    description,
    type,
    capacity,
    price,
    startDate,
    endDate,
  } = event;

  const payload = {
    id,
    groupId,
    venueId,
    name,
    description,
    type,
    capacity,
    price,
    startDate,
    endDate,
    numAttending: event.dataValues.numAttending,
    Group: event.Group,
    Venue: event.Venue,
    EventImages: event.EventImage,
  };

  res.json(payload);
});

// Add image to event by eventId
router.post("/:eventId/images", [requireAuth, eventAuth], async (req, res, next) => {

    const { url, preview } = req.body;

    const newImage = await EventImage.create({
        eventId: parseInt(req.params.eventId),
        url,
        preview
    });

    const payload = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview 
    };

    res.json(payload);
});

module.exports = router;
