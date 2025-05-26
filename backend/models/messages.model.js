import { DataTypes } from 'sequelize';

const Message = (sequelize) => {
  const model = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    chat_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Messages',
    timestamps: false
  });

  model.associate = function(models) {
    model.belongsTo(models.Chat, {
      foreignKey: 'chat_id',
      as: 'Chat',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    model.belongsTo(models.UserInfo, {
      foreignKey: 'sender_id',
      as: 'Sender',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return model;
};

export default Message;