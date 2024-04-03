"use strict";

const { Event } = require("../models");

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
    await Event.bulkCreate(
      [
        {
          venueId: 1,
          groupId: 1,
          name: "SF Book Club: Meeting 1",
          description:
            "Meet outside of Peet's Coffee, don't forget to bring your book!",
          type: "In Person",
          capacity: 15,
          price: 0,
          startDate: "2024-04-05",
          endDate: "2024-04-05",
        },
        {
          venueId: 2,
          groupId: 1,
          name: "SF Book Club: Meeting 2",
          description:
            "Meet outside of Peet's Coffee, don't forget to bring your book!",
          type: "In Person",
          capacity: 15,
          price: 0,
          startDate: "2024-04-012",
          endDate: "2024-04-012",
        },
        {
          venueId: 3,
          groupId: 2,
          name: "Painting Session",
          description:
            "All materials will be provided for this event. Come ready to get creative and paint!",
          type: "In Person",
          capacity: 20,
          price: 10,
          startDate: "2024-07-10",
          endDate: "2024-07-10",
        },
        {
          groupId: 3,
          name: "Coffee and Chat",
          description:
            "Come ready with your coffe and join us on an afternoon chat directly from the comfort of your home!",
          type: "Online",
          capacity: 30,
          price: 0,
          startDate: "2024-06-14",
          endDate: "2024-06-14",
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
    options.tableName = "Events";
    // const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
