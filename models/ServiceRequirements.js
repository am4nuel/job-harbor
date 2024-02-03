module.exports = (sequelize, dataTypes) => {
  const ServiceRequirements = sequelize.define("ServiceRequirements", {
    requirement: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    requirementPrice: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });

  return ServiceRequirements;
};
