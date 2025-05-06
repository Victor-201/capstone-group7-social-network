const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatParticipant = sequelize.define('ChatParticipant', {
    chat_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'ChatParticipants',
    timestamps: false
  });

  ChatParticipant.associate = function(models) {
    ChatParticipant.belongsTo(models.Chat, { foreignKey: 'chat_id' });
    ChatParticipant.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
  };

  return ChatParticipant;
};
