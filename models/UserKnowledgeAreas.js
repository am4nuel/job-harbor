module.exports = (sequelize, dataTypes) => {
  const UserKnowledgeAreas = sequelize.define("UserKnowledgeAreas", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    knowledgeName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserKnowledgeAreas;
};
