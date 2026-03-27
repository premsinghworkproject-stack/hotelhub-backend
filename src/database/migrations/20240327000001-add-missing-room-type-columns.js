'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add missing columns to room_types table
    await queryInterface.addColumn('room_types', 'hasSeaView', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('room_types', 'hasMountainView', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('room_types', 'hasCityView', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('room_types', 'isSmokingAllowed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('room_types', 'isPetFriendly', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Add indexes for new columns
    await queryInterface.addIndex('room_types', ['hasSeaView'], {
      name: 'idx_room_types_hasSeaView',
    });

    await queryInterface.addIndex('room_types', ['hasMountainView'], {
      name: 'idx_room_types_hasMountainView',
    });

    await queryInterface.addIndex('room_types', ['hasCityView'], {
      name: 'idx_room_types_hasCityView',
    });

    await queryInterface.addIndex('room_types', ['isSmokingAllowed'], {
      name: 'idx_room_types_isSmokingAllowed',
    });

    await queryInterface.addIndex('room_types', ['isPetFriendly'], {
      name: 'idx_room_types_isPetFriendly',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('room_types', 'idx_room_types_hasSeaView');
    await queryInterface.removeIndex('room_types', 'idx_room_types_hasMountainView');
    await queryInterface.removeIndex('room_types', 'idx_room_types_hasCityView');
    await queryInterface.removeIndex('room_types', 'idx_room_types_isSmokingAllowed');
    await queryInterface.removeIndex('room_types', 'idx_room_types_isPetFriendly');

    // Remove columns
    await queryInterface.removeColumn('room_types', 'hasSeaView');
    await queryInterface.removeColumn('room_types', 'hasMountainView');
    await queryInterface.removeColumn('room_types', 'hasCityView');
    await queryInterface.removeColumn('room_types', 'isSmokingAllowed');
    await queryInterface.removeColumn('room_types', 'isPetFriendly');
  },
};
