module.exports = (sequelize, dataTypes) => {
  const Professions = sequelize.define(
    "Professions",
    {
      name: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      timestamps: false,
    }
  );
  return Professions;
};
