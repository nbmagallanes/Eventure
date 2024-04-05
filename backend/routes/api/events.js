const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, Venue, Event, GroupImage, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

async function attendingTotal(events) {
    if (events.length > 1) {
        for (let event of events) {
            const numAttending = await Attendance.count({
            where: { eventId: event.id }
            });
            event.dataValues.numAttending = numAttending;
        }   
    } else {
        const numAttending = await Attendance.count({
            where: { eventId: events.id }
        });
        events.dataValues.numAttending = numAttending;
    }
};

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
};

// Get events
router.get('/', async (req, res, next) => {

    const events = await Event.findAll({
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        include: [
            { 
                model: Group,
                attributes: ["id", "name", "city", "state"]
            }, {
                model: Venue,
                attributes: ["id", "city", "state"]
            }
        ]   
    });

    await attendingTotal(events);
    await eventsImagePreview(events);

    res.json({"Events": events});
});

// Get details of event by id
router.get('/:eventId', async (req, res, next) => {

    const event = await Event.findByPk(req.params.eventId, {
        attributes: { exclude: ["createdAt", "updatedAt"]},
        include: [
            { 
                model: Group,
                attributes: ["id", "name", "private", "city", "state"]
            }, { 
                model: Venue,
                attributes: ["id", "address", "city", "state", "lat", "lng"]
            }, { 
                model: EventImage,
                attributes: ["id", "url", "preview"]
            }
        ]
    });

    if (!event) {
        const err = new Error("Event not found");
        err.message = "Event couldn't be found";
        err.status = 404;
        return next(err);
    }

    await attendingTotal(event); 
    
    const { id, groupId, venueId, name, description, type, capacity, price, startDate, endDate} = event;

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
        EventImages: event.EventImage
    };

    res.json(payload);
})

module.exports = router;