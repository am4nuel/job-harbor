module.exports = (sequelize, dataTypes) => {
  const Requests = sequelize.define("Requests", {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    requestedFrom: {
      type: dataTypes.STRING,
      primaryKey: false,
      allowNull: false,
    },
    requestedTo: {
      type: dataTypes.STRING,
      primaryKey: false,
      allowNull: false,
    },
    requestStatus: {
      type: dataTypes.STRING,
      primaryKey: false,
      defaultValue: "requested",
    },
    requestTime: {
      type: dataTypes.TIME,
    },
  });
  return Requests;
};
