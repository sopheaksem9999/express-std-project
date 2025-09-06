"use strict";

const { TABLE_NAME } = require("../constants/tableEnum");

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    "Location",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: TABLE_NAME.LOCATION,
      timestamps: true,
      hooks: {
        beforeCreate: async (location) => {
          // Add any location-specific logic here
        },
        beforeUpdate: async (location) => {
          // Add any location-specific logic here
        },
      },
    }
  );

  // Class method for associations
  Location.associate = function (models) {
    // Define associations here if needed
    Location.hasMany(models.Store, { foreignKey: "location_id", as: "stores" });
  };

  return Location;
};
