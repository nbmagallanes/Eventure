"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
      });

      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "CASCADE",
      })
    }
  }
  Event.init(
    {
      venueId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("Online", "In Person"),
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
