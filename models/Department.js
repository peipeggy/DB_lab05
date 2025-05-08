const { sequelize, DataTypes } = require('../orm');

const Department = sequelize.define('Department', {
  Department_ID: {
    type: DataTypes.STRING(5),
    primaryKey: true
  },
  Name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Location: DataTypes.STRING(30),
}, {
  tableName: 'DEPARTMENT',
  timestamps: false
});

module.exports = Department;
