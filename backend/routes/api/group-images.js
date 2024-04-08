const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Group, GroupImage, Membership } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Delete group image
router.delete('/:imageId', requireAuth, async (req, res, next) => {

    const image = await GroupImage.findByPk(req.params.imageId);

    if (!image) {
        const err = new Error("Image not found");
        err.message = "Group image couldnt be found";
        err.status = 404;
        return next(err);

    }

    const coHost = await Membership.findOne({
        where: { 
            userId: req.user.id,
            groupId: image.groupId,
            status: "co-host"
        }
    });

    const group = await Group.findByPk(image.groupId);

    if (req.user.id !== group.organizerId && !coHost) {
        const err = new Error("Authorization Error");
        err.title = "Authorization Error";
        err.message = "Forbidden";
        err.status = 403;
        return next(err);
    };

    await image.destroy();

    res.json({
        "message": "Successfully deleted"
    })
});


module.exports = router;