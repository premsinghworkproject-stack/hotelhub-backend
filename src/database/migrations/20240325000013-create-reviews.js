'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      pros: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cons: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      helpfulCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      hotelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('reviews', ['hotelId'], {
      name: 'idx_reviews_hotelId',
    });

    await queryInterface.addIndex('reviews', ['userId'], {
      name: 'idx_reviews_userId',
    });

    await queryInterface.addIndex('reviews', ['rating'], {
      name: 'idx_reviews_rating',
    });

    await queryInterface.addIndex('reviews', ['isVerified'], {
      name: 'idx_reviews_isVerified',
    });

    await queryInterface.addIndex('reviews', ['isPublished'], {
      name: 'idx_reviews_isPublished',
    });

    // Composite indexes for common queries
    await queryInterface.addIndex('reviews', ['hotelId', 'isPublished'], {
      name: 'idx_reviews_hotelId_isPublished',
    });

    await queryInterface.addIndex('reviews', ['hotelId', 'rating'], {
      name: 'idx_reviews_hotelId_rating',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('reviews', 'idx_reviews_hotelId');
    await queryInterface.removeIndex('reviews', 'idx_reviews_userId');
    await queryInterface.removeIndex('reviews', 'idx_reviews_rating');
    await queryInterface.removeIndex('reviews', 'idx_reviews_isVerified');
    await queryInterface.removeIndex('reviews', 'idx_reviews_isPublished');
    await queryInterface.removeIndex('reviews', 'idx_reviews_hotelId_isPublished');
    await queryInterface.removeIndex('reviews', 'idx_reviews_hotelId_rating');

    // Drop table
    await queryInterface.dropTable('reviews');
  },
};
