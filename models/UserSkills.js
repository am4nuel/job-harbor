module.exports = (sequelize, dataTypes) => {
  const UserSkills = sequelize.define("UserSkills", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    skillName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserSkills;
};
