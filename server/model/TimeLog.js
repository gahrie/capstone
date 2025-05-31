const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TimeLog = sequelize.define("TimeLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  guest_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time_in: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  time_out: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_activated: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = TimeLog; 