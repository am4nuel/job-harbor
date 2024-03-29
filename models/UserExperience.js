module.exports = (sequelize, dataTypes) => {
  const UserExperience = sequelize.define("UserExperience", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    jobTitledDate: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    startYear: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    endYear: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserExperience;
};
