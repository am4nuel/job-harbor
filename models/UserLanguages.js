module.exports = (sequelize, dataTypes) => {
  const UserLanguages = sequelize.define("UserLanguages", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    languageName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserLanguages;
};
