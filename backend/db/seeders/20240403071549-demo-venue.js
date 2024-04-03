"use strict";

const { Venue } = require("../models");

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
    await Venue.bulkCreate(
      [
        {
          groupId: 1,
          address: "2300 16th St",
          city: "San Francisco",
          state: "CA",
          lat: 37.76660677250391,
          lng: -122.41041993242122,
        },
        {
          groupId: 1,
          address: "601 Van Ness Ave",
          city: "San Francisco",
          state: "CA",
          lat: 37.78240395056398,
          lng: -122.42090196663631,
        },
        {
          groupId: 2,
          address: "1310 Haight St",
          city: "San Francisco",
          state: "CA",
          lat: 37.770722449876274,
          lng: -122.44395170250561,
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
    options.tableName = "Venues";
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
