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
          url: "https://www.jacksonsart.com/blog/wp-content/uploads/2020/12/unnamed.jpg",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://3.bp.blogspot.com/-KG-eDVbl-4c/WZ8HWW2TRwI/AAAAAAAAFwc/4wGKpKr-RiItl62bgRfGuER6y_GSOz2-gCLcBGAs/s1600/2017_HRVAW_KimEnglish-11.jpg",
          preview: false,
        },
        {
          groupId: 3,
          url: "https://blog.cryptoflies.com/wp-content/uploads/2023/12/sony-bbc-earth-nature-metaverse-experience-585x346.png",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://americanhiking.org/wp-content/uploads/2017/03/P1010042-750x563.jpg",
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
