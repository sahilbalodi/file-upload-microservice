module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('uploads', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    clientIdNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: 'uniqueTag'
    },
    imgNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: 'uniqueTag'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }, {
    uniqueKeys: {
      uniqueTag: {
        fields: ['clientIdNumber', 'imgNumber']
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('uploads'),
};
