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
          url: "UrlHolder2",
          preview: false,
        },
        {
          eventId: 2,
          url: "UrlHolder3",
          preview: true,
        },
        {
          eventId: 3,
          url: "UrlHolder4",
          preview: true,
        },
        {
          eventId: 3,
          url: "UrlHolder5",
          preview: false,
        },
        {
          eventId: 4,
          url: "UrlHolder5",
          preview: false,
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
