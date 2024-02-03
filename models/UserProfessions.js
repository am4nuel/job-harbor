module.exports = (sequelize, dataTypes) => {
  const UserProfessions = sequelize.define("UserProfessions", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    professionName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserProfessions;
};
