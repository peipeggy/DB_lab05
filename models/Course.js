const { sequelize, DataTypes } = require('../orm');

const Course = sequelize.define('Course', {
  Course_ID: {
    type: DataTypes.STRING(8),
    primaryKey: true
  },
  Title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Department_ID: DataTypes.STRING(5),

}, {
  tableName: 'COURSE',
  timestamps: false
});

module.exports = Course;
