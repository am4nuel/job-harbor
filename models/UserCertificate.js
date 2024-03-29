module.exports = (sequelize, dataTypes) => {
  const UserCertificate = sequelize.define("UserCertificate", {
    userId: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    CertificateName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    CertificateGivenBy: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    issuedDate: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    expireDate: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });
  return UserCertificate;
};
