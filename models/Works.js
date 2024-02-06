module.exports = (sequelize, dataTypes) => {
  const Works = sequelize.define("Works", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    fileLink: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return Works;
};
