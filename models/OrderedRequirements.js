module.exports = (sequelize, dataTypes) => {
  const OrderedRequirements = sequelize.define("OrderedRequirements", {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: dataTypes.STRING,
    },
    requirement: {
      type: dataTypes.STRING,
    },
    serviceId: {
      type: dataTypes.STRING,
    },
  });
  return OrderedRequirements;
};
