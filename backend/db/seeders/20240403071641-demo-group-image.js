"use strict";

const { GroupImage } = require("../models");

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
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "https://images.stockcake.com/public/9/9/4/9947ad79-779f-42df-bbe0-d4274324f54d_large/reading-in-nature-stockcake.jpg",
          preview: true,
        },
        {
          groupId: 2,
          url: "placeHolderUrl2",
          preview: false,
        },
        {
          groupId: 2,
          url: "placeHolderUrl3",
          preview: true,
        },
        {
          groupId: 3,
          url: "placeHolderUrl4",
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
