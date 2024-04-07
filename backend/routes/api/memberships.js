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

module.exports = router;
