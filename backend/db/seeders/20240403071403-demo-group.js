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
          name: "San Francisco Book Club: Dolores Park",
          about:
            "We are a book club located in San Francisco. We meet up every other week to go over the current book we are reading and hang out. Join us if you are a book lover!",
          type: "In person",
          private: false,
          city: "San Francisco",
          state: "CA",
        },
        {
          organizerId: 2,
          name: "Outdoor Artists Collective",
          about:
            "Join and paint with us! Our group holds many events throughout the Bay Area where we go out to beautiful landscapes and try to recreate them.",
          type: "In person",
          private: true,
          city: "San Francisco",
          state: "CA",
        },
        {
          organizerId: 3,
          name: "Virtual Nature Explorers",
          about:
            "We offer a platform for virtual nature walks, wildlife live streams, and online educational events about different ecosystems and conservation efforts.",
          type: "Online",
          private: false,
          city: "Davis",
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
