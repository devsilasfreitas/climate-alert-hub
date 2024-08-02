'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "light",
        validate: {
          isIn: [["light", "dark"]]
        }
      },
      receiveEmail: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
