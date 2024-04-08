const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Group, GroupImage, Membership, Venue, User, Event, Attendance, EventImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router({mergeParams: true});

const checkGroup = async (req, res, next) => {

    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
        const err = new Error("Group not found");
        err.message = "Group couldn't be found";
        err.status = 404;
        return next(err);
    };

    return next();
}

// Get all members of a group by its id
router.get('/', checkGroup, async (req, res, next) => {

    let query = {
        where: {},
        include: [],
    };

    const group = await Group.findByPk(req.params.groupId);

    const coHost = await Membership.findOne({
        where: { 
            userId: req.user.id,
            groupId: parseInt(req.params.groupId),
            status: "co-host"
        }
    });

    query.attributes = ["id", "firstName", "lastName"]

    if (req.user.id === group.organizerId || coHost) {
        query.include.push({
            model: Membership,
            where: { groupId: parseInt(req.params.groupId) },
            attributes: ["status"]
        });
    } else {
        query.include.push({
            model: Membership,
            where: { 
                groupId: parseInt(req.params.groupId),
                status: ["co-host", "member"]
            },
            attributes: ["status"]
        });
    };

    const members = await User.findAll(query);

    let newArr =[];
    if (members) {
        members.forEach(member => { newArr.push(member.toJSON()) })
        newArr.forEach(member => { member.Memberships =  member.Memberships[0]})
    };

    res.json({"Members": newArr})
});

module.exports = router;