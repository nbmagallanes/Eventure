'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {
        foreignKey: "organizerId"
      });

      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE"
      });

      Group.hasMany(models.Venue, {
        foreignKey: "groupId",
        onDelete: "CASCADE"
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE"
      });

      Group.hasMany(models.Membership, {
        foreignKey: "groupId",
        onDelete: "CASCADE"
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 60],
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50]
      }
    },     
    type: {
      type: DataTypes.ENUM("Online", "In person"),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },     
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      // defaultValue: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },    
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};