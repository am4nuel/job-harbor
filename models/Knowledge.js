module.exports = (sequelize, dataTypes) => {
  const Knowledge = sequelize.define(
    "Knowledge",
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
  return Knowledge;
};
