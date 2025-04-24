const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Follower = sequelize.define('Follower', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'follower_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'followed_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'followers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Follower.associate = (models) => {
    Follower.belongsTo(models.User, { foreignKey: 'follower_id', as: 'follower' });
    Follower.belongsTo(models.User, { foreignKey: 'followed_id', as: 'followed' });
  };

  return Follower;
};