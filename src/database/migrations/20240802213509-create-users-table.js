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
      recive_email: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      token: {
        type: Sequelize.CHAR(1200),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
