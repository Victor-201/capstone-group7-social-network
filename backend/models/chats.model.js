import { DataTypes } from 'sequelize';

const Chat = (sequelize) => {
  const model = sequelize.define('Chat', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    is_group: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Chats',
    timestamps: false
  });

  model.associate = function(models) {
    model.hasMany(models.ChatParticipant, {
      foreignKey: 'chat_id',
      as: 'Participants',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    model.hasMany(models.Message, {
      foreignKey: 'chat_id',
      as: 'Messages',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };


  return model;
};
export default Chat;