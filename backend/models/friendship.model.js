const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Friendship = sequelize.define('Friendship', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id_1',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    userId2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id_2',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'blocked'),
      allowNull: false,
      defaultValue: 'pending'
    },
    actionUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'action_user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'friendships',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Friendship.associate = (models) => {
    Friendship.belongsTo(models.User, { foreignKey: 'user_id_1', as: 'user1' });
    Friendship.belongsTo(models.User, { foreignKey: 'user_id_2', as: 'user2' });
    Friendship.belongsTo(models.User, { foreignKey: 'action_user_id', as: 'actionUser' });
  };

  return Friendship;
};