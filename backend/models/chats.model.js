const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chat = sequelize.define('Chat', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
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

  Chat.associate = function(models) {
    Chat.hasMany(models.ChatParticipant, {
      foreignKey: 'chat_id',
      as: 'Participants'
    });

    Chat.hasMany(models.Message, {
      foreignKey: 'chat_id',
      as: 'Messages'
    });
  };

  return Chat;
};
