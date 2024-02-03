module.exports = (sequelize, dataTypes) => {
  const Skills = sequelize.define(
    "Skills",
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
  return Skills;
};
