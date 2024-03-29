module.exports = (sequelize, dataTypes) => {
  const UserEducation = sequelize.define("UserEducation", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    university: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    field: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserEducation;
};
