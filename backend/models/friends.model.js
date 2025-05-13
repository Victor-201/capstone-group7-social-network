import { DataTypes } from 'sequelize';

const Friend = (sequelize) => {
  const model = sequelize.define('Friend', {
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

  model.associate = (models) => {
    model.belongsTo(models.UserInfo, { foreignKey: 'user_id', as: 'Requester' });
    model.belongsTo(models.UserInfo, { foreignKey: 'friend_id', as: 'Recipient' });
  };

  return model;
};
export default Friend;