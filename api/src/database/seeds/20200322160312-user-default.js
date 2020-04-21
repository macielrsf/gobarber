'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
      */
        const password_hash = bcrypt.hashSync('0df0bd859b', 8);

        return queryInterface.bulkInsert('users', [{
            name: 'Maciel Santos',
            email: 'macielrsf@gmail.com',
            password_hash,
            provider: true,
            created_at: new Date(),
            updated_at: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
      */
    }
};
