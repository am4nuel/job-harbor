module.exports = (sequelize, dataTypes) => {
  const UserPrevProjects = sequelize.define("UserPrevProjects", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserPrevProjects;
};
