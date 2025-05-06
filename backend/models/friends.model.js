const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Friends = sequelize.define('Friends', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    friend_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
  }, {
    tableName: 'friends',
    timestamps: false,
  });

  Friends.associate = (models) => {
    Friends.belongsTo(models.UserInfo, { foreignKey: 'user_id', as: 'Requester' });
    Friends.belongsTo(models.UserInfo, { foreignKey: 'friend_id', as: 'Recipient' });
  };

  return Friends;
};
