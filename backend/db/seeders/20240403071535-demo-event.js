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
            "For this first even we will be meeting outside of Peet's Coffee, don't forget to bring your book!",
          type: "In person",
          capacity: 15,
          price: 0,
          startDate: "2024-04-05 01:00 PM",
          endDate: "2024-04-05 02:00 PM",
        },
        {
          venueId: 2,
          groupId: 1,
          name: "SF Book Club: Meeting 2",
          description:
            "We will be having a picnic but potluck style, please bring food to share with everyone",
          type: "In person",
          capacity: 15,
          price: 0,
          startDate: "2024-04-12 10:00 AM",
          endDate: "2024-04-12  11:30 AM",
        },
        {
          venueId: 2,
          groupId: 1,
          name: "SF Book Club: Meeting 3",
          description:
            "After a long break, we are back with the meetings and are excited to be all together again. We will meet on the corner of Dolores Park",
          type: "In person",
          capacity: 15,
          price: 0,
          startDate: "2024-07-12 03:30 PM",
          endDate: "2024-07-12 05:00 PM",
        },
        {
          venueId: 3,
          groupId: 2,
          name: "Painting Event at Golden Gate Park",
          description:
            "All materials will be provided for this event. Come ready to be creative and paint! We will be meating at Golden Gate Park",
          type: "In person",
          capacity: 20,
          price: 10,
          startDate: "2024-07-10 04:00 PM",
          endDate: "2024-07-10 05:00 PM",
        },
        {
          groupId: 3,
          name: "Online Eco-Workshop: Ecosystems and Conservation",
          description:
            "This event will feature expert presentations on different ecosystems, from tropical rainforests to arid deserts, and the unique challenges each faces.",
          type: "Online",
          capacity: 30,
          price: 0,
          startDate: "2024-06-14 12:30 PM",
          endDate: "2024-06-14 02:00 PM",
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
