module.exports = (sequelize, dataTypes) => {
  const ServiceOrder = sequelize.define("ServiceOrder", {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: dataTypes.INTEGER,
      primaryKey: true,
    },
    deliveryDate: {
      type: dataTypes.DATEONLY,
    },
    deliveryTime: {
      type: dataTypes.TIME,
    },
  });
  return ServiceOrder;
};
