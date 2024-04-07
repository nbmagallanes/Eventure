const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  Group,
  GroupImage,
  Membership,
  Venue,
  User,
  Event,
  Attendance,
  EventImage,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router({ mergeParams: true });

const checkGroup = async (req, res, next) => {

  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    const err = new Error("Group not found");
    err.message = "Group couldn't be found";
    err.status = 404;
    return next(err);
  }

  return next();
};

const membershipAuth = async (req, res, next) => {

    const group = await Group.findByPk(req.params.groupId);

    if (req.user.id !== group.organizerId) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "You are not this groups' organizer or co-host";
        err.status = 403;
        return next(err);
    };

    return next();

};

//Request membership
router.post("/", [requireAuth, checkGroup], async (req, res, next) => {

  const membership = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: parseInt(req.params.groupId),
    },
  });

  let result;

  if (!membership) {

    const newMembership = await Membership.create({
      userId: req.user.id,
      groupId: parseInt(req.params.groupId),
      status: "pending",
    });

    const payload = {
      memberId: req.user.id,
      status: "pending",
    };

    result = payload;

  } else if (membership.status === "pending") {

    const err = new Error("Membership pending error");
    err.status = 400;
    err.message = "Membership has already been requested";
    return next(err);

  } else if (membership.status === "member" || membership.status === "co-host") {

    const err = new Error("Membership error");
    err.status = 400;
    err.message = "User is already a member of the group";
    return next(err);
  }

  res.json(result);
});

// Change status of a membership by group
router.put('/', [requireAuth, checkGroup, membershipAuth], async (req, res, next) => {

    const reqUserMembership = await Membership.findOne({ where: { userId: req.user.id, groupId: parseInt(req.params.groupId) } })

    const { memberId, status } = req.body

    const group = await Group.findByPk(req.params.groupId);

    const user = await User.findByPk(memberId);

    if (!user) {
        const err = new Error("User not found");
        err.message = "User couldn't be found";
        err.status = 404;
        return next(err);
    };

    const membership = await Membership.findOne({
        where: { userId: user.id, groupId: parseInt(req.params.groupId) }
    });

    if (!membership) {
        const err = new Error("Membership not found");
        err.message = "Membership between the user and the group does not exist";
        err.status = 404;
        return next(err);
    };

    if (status === "pending") {
        const err = new Error("Pending change error");
        err.message = "Cannot change a membership status to pending";
        err.status = 400;
        return next(err);

    }

    if (group.organizerId === req.user.id && membership.status === "member" && status === "co-host") {
        
        updateStatus = await membership.update({
            status: status
        });

    } else if ((group.organizerId === req.user.id || 
        (reqUserMembership && reqUserMembership.status === "co-host")) &&
        (membership.status === "pending" && status === "member")) {
            updateStatus = await membership.update({
                status: status
            });
    } 

    const payload = {
        id: membership.id,
        groupId: parseInt(req.params.groupId),
        memberId: user.id,
        status: updateStatus.status
    }

    res.json(payload)
});

// Delete membership
router.delete('/:memberId', [requireAuth, checkGroup], async (req, res, next) => {

    const user = await User.findByPk(parseInt(req.params.memberId));

    if (!user) {
        const err = new Error("User not found");
        err.message = "User couldn't be found";
        err.status = 404;
        return next(err);
    };

    const group = await Group.findByPk(req.params.groupId);

    if (req.user.id !== group.organizerId && req.user.id !== parseInt(req.params.memberId)) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "You are not this groups' organizer or this membership's owner";
        err.status = 403;
        return next(err);
    };

    const membership = await Membership.findOne({
        where: {
            userId: parseInt(req.params.memberId),
            groupId: parseInt(req.params.groupId)
        }
    });

    if (!membership) {
        const err = new Error("Membership not found");
        err.message = "Membership does not exist for this User";
        err.status = 404;
        return next(err);
    };

    membership.destroy();

    res.json( {
        "message": "Succesfully deleted membership from group"
    });
});

module.exports = router;
