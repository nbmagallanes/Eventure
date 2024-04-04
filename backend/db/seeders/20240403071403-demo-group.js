"use strict";

const { Group } = require("../models");

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
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "SF Book Club",
          about:
            "Book Club in San Francisco that focuses on fostering a safe community",
          type: "In person",
          private: false,
          city: "San Francisco",
          state: "CA",
        },
        {
          organizerId: 2,
          name: "The Painters Club",
          about:
            "We are a Painting Club that encourages people to tap into their creativity and provide many events",
          type: "In person",
          private: true,
          city: "San Francisco",
          state: "CA",
        },
        {
          organizerId: 3,
          name: "The Bay Area Social Club",
          about:
            "Social Club that focuses on making connections through online events, mostly based around San Mateo",
          type: "Online",
          private: false,
          city: "San Mateo",
          state: "CA",
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
    options.tableName = "Groups";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
