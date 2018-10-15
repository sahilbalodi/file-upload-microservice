module.exports = (sequelize, DataTypes) => {
  const uploads = sequelize.define('uploads', {
    clientIdNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imgNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['clientIdNumber', 'imgNumber']
      }
    ]
  });
  uploads.associate = function (models) {
  };
  return uploads;
};
