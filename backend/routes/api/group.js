const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateCreateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60})
        .withMessage("Name must be 60 characters or less"),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50})
        .withMessage("About must be 50 characters or more"),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(["Online", "In person"])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .isBoolean()
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
    handleValidationErrors
];

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

const validateEvent = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(["Online", "In person"])
        .withMessage("Type must be Online or In person"),
    check('capacity')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    handleValidationErrors
];

async function memberTotal(groups) {
    if (groups.length) {
        for (let group of groups) {
            const numMembers = await Membership.count({
            where: { groupId: group.id }
            });
            group.dataValues.numMembers = numMembers;
        }   
    } else {
        const numMembers = await Membership.count({
            where: { groupId: groups.id }
        });
        groups.dataValues.numMembers = numMembers;
    }
};

async function attendingTotal(events) {
    if (events.length) {
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

async function imagePreview(groups) {
  for (let group of groups) {
    const image = await GroupImage.findOne({
      where: {
        groupId: group.id,
        preview: true,
      },
    });

    if (image) group.dataValues.previewImage = image.url;
    else group.dataValues.previewImage = null;
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

async function groupAuth(req, res, next) {

    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
        const err = new Error("Group not found");
        err.message = "Group couldn't be found";
        err.status = 404;
        return next(err);
    };

    if (req.user.id !== group.organizerId) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "You are not this groups' Organizer";
        err.status = 403;
        return next(err);
    };

    return next();

};

async function venueAuth(req, res, next) {

    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
        const err = new Error("Group not found");
        err.message = "Group couldn't be found";
        err.status = 404;
        return next(err);
    };

    const membership = await Membership.findOne({
        where: {
         userId: req.user.id,
         groupId: req.params.groupId
        }
     });

    if ((!membership) || (req.user.id !== group.organizerId && membership.status !== "co-host")) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "You are not the organizer or co-host of this group";
        err.status = 403;
        return next(err);
    };

    return next();
};

// Get all groups
router.get("/", async (req, res, next) => {
  const groups = await Group.findAll();

  await memberTotal(groups);
  await imagePreview(groups);

  return res.json({ Groups: groups });
});

// Get groups joined or organized by Current User
router.get("/current", requireAuth, async (req, res, next) => {
    let newArr = [];
    const groupOrg = await Group.findAll({ where: { organizerId: req.user.id } });
    
    const groupMem = await Group.findAll({
        include: {
            model: Membership,
            where: {
                userId: req.user.id,
                status: { [Op.or]: ["co-host", "member"] }
            },
            attributes: []
        },
    });

    const groups = [...groupOrg, ...groupMem];

    for (let group of groups) {
        await memberTotal(groups);
        await imagePreview(groups);

        const payload = {
            ...group.toJSON()
        };

        payload.createdAt = payload.createdAt.toString();
        payload.updatedAt = payload.updatedAt.toString();

        newArr.push(payload);
    };
  
  return res.json({ "Groups": newArr});
});

// Get group info by Id
router.get("/:groupId", async(req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [
            {
                model:  GroupImage,
                attributes: { exclude : ["groupId", "createdAt", "updatedAt"] }
            }, {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }, {
                model:  Venue,
                attributes: { exclude : ["createdAt", "updatedAt"] }
            }
        ]  
    });

    if (!group) {
        const err = new Error("Group not found");
        err.status = 404;
        err.message = "Group couldn't be found";
        return next(err);
    }

    await memberTotal(group);
    // console.log(group.dataValues.numMembers)

    const { id, organizerId, name, about, type, private, city, state, createdAt, updatedAt, numMembers} = group;

    const payload = {
        id, 
        organizerId, 
        name, 
        about, 
        type, 
        private, 
        city, 
        state, 
        createdAt, 
        updatedAt,
        numMembers: group.dataValues.numMembers,
        GroupImages: group.GroupImages,
        Organizer: group.User,
        Venues: group.Venues
    };
    

    return res.json(payload);
}) ;

// Create group
router.post('/', [requireAuth, validateCreateGroup], async (req, res, next) => {

    const { name, about, type, private, city, state } = req.body;

    const group = await Group.create({ organizerId: req.user.id ,name, about, type, private, city, state });

    if (group) res.status(201);
    return res.json(group);
});

// Add image to group by group Id
router.post('/:groupId/images', [requireAuth, groupAuth], async (req, res) => {

    const newImage = await GroupImage.create({
        groupId: parseInt(req.params.groupId),
        url: req.body.url,
        preview: req.body.preview,
    });

    const { id, url, preview} = newImage;

    const payload = {
        id,
        url,
        preview 
    };

    res.json(payload);

});

// Edit group
router.put('/:groupId', [requireAuth, groupAuth, validateCreateGroup], async (req, res, next) => {

    const { name, about, type, private, city, state } = req.body;

    const group = await Group.findByPk(req.params.groupId);

    const updatedGroup = await group.update({
        name,
        about,
        type,
        private,
        city,
        state
    });

    res.json(updatedGroup);
})

// Delete group
router.delete('/:groupId', [requireAuth, groupAuth], async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    group.destroy();

    res.json({
        "message": "Succesfully deleted"
    })
})

// Get all venues for a group by id
router.get("/:groupId/venues", [requireAuth, venueAuth], async (req, res, next) => {
    const venues = await Venue.findAll({
       where: {
        groupId: req.params.groupId
       },
       attributes: { exclude : ["createdAt", "updatedAt"] }
    });

    res.json({ "Venues": venues});
});

// Create venue for a group by id
router.post('/:groupId/venues', [requireAuth, venueAuth, validateVenue], async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;

    const newVenue = await Venue.create({ 
        groupId: parseInt(req.params.groupId), 
        address, 
        city, 
        state, 
        lat, 
        lng 
    });

    const payload = {
        id: newVenue.id,
        groupId: newVenue.groupId, 
        address: newVenue.address, 
        city: newVenue.city, 
        state: newVenue.state, 
        lat: newVenue.lat, 
        lng: newVenue.lng
    }

    res.json(payload);
});

/// Get events of a group by id
router.get('/:groupId/events', async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
        const err = new Error("Group not found");
        err.message = "Group couldn't be found";
        err.status = 404;
        return next(err);
    };

    const events = await Event.findAll({
        where: {
            groupId: parseInt(req.params.groupId)
        },
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        include: [
            { 
                model: Group,
                attributes: ["id", "name", "city", "state"]
            },
            { 
            model: Venue,
            attributes: ["id", "city", "state"]
            }
        ]
    });

    await attendingTotal(events);
    await eventsImagePreview(events);

    res.json({ "Events": events });

});

// Create event for a group by id
router.post('/:groupId/events', [requireAuth, venueAuth, validateEvent], async (req, res, next) => {

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    let sDate = new Date(startDate)
    let eDate = new Date(endDate)
    let today = new Date()

    if (sDate < today) {
        const err = new Error("Start Date Error");
        err.status = 400;
        err.message = "Start date must be in the future";
        return next(err);
    } else if (sDate > eDate) {
        const err = new Error("End date Error");
        err.status = 400;
        err.message = "End date is less than start date";
        return next(err);
    };

    const venue = await Venue.findByPk(venueId);

    if (!venue) { 
    const err = new Error("No Venue Found");
    err.status = 404;
    err.message = "Venue couldn't be found";
    return next(err);

    }

    const newEvent = await Event.create({
        groupId: parseInt(req.params.groupId),
        venueId, 
        name, 
        type, 
        capacity, 
        price, 
        description, 
        startDate, 
        endDate
    });

    const payload = {
        id: newEvent.id,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate
    }

    res.json(payload)
});
//change


module.exports = router;
