"use strict";

const { TABLE_NAME } = require("../constants/tableEnum");

module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
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
        allowNull: true,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "locations",
          key: "id",
        },
      },
    },
    {
      tableName: TABLE_NAME.STORE,
      timestamps: true,
      hooks: {
        beforeCreate: async (store) => {
          // Add any store-specific logic here
        },
        beforeUpdate: async (store) => {
          // Add any store-specific logic here
        },
      },
    }
  );

  // Class method for associations
  Store.associate = function (models) {
    // Define associations here if needed
    Store.belongsTo(models.Location, {
      foreignKey: "location_id",
      as: "location",
    });
  };

  return Store;
};
