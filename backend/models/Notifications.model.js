import { DataTypes } from 'sequelize';

const Notification = (sequelize) => {
  const model = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action_type: {
      type: DataTypes.ENUM('post', 'comment', 'like', 'friend_request', 'message', 'friend_respond', 'reply_comment'),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    action_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'notifications',
    timestamps: false,
  });

  model.associate = (models) => {
    model.belongsTo(models.UserInfo, {
      foreignKey: 'sender_id',
      as: 'sender',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    model.belongsTo(models.UserInfo, {
      foreignKey: 'receiver_id',
      as: 'receiver',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return model;
};

export default Notification;