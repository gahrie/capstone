const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TimeLog = require("./TimeLog");

const Guest = sequelize.define("Guest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Guest.hasMany(TimeLog, { foreignKey: 'guest_id' });
TimeLog.belongsTo(Guest, { foreignKey: 'guest_id' });

module.exports = Guest;
