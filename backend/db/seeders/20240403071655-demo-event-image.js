"use strict";

const { EventImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await EventImage.bulkCreate(
      [
        {
          eventId: 1,
          url: "https://www.fodors.com/assets/destinations/708044/dolores-park-san-francisco-california-usa_main.jpg",
          preview: true,
        },
        {
          eventId: 1,
          url: "https://cloudinary-assets.dostuffmedia.com/res/dostuff-media/image/upload/venue-56254/1503005876.jpg",
          preview: false,
        },
        {
          eventId: 2,
          url: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1nKEs8.img?w=800&h=415&q=60&m=2&f=jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://www.altenconstruction.com/projects/images/Mission-Dolores-Park-7.jpg",
          preview: true,
        },
        {
          eventId: 4,
          url: "https://www.howtopastel.com/wp-content/uploads/2023/06/Students-in-my-Yorkshire-Dales-workshop.png",
          preview: true,
        },
        {
          eventId: 5,
          url: "https://www.tiredearth.com/images/720/eco%20(1).jpg",
          preview: true,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "GroupImages";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
