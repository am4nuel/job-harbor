module.exports = (sequelize, dataTypes) => {
  const Services = sequelize.define("Services", {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    serviceDescription: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    serviceCategory: {
      type: dataTypes.STRING,
      allowNull: true,
    },
    serviceId: {
      type: dataTypes.VIRTUAL,
      get() {
        return `jh${this.getDataValue("id")}s`;
      },
    },
  });
  return Services;
};
