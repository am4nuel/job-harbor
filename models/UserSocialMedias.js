module.exports = (sequelize, dataTypes) => {
  const UserSocialMedias = sequelize.define("UserSocialMedias", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    socialName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    socialLink: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserSocialMedias;
};
