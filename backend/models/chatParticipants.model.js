import { DataTypes } from 'sequelize';

const ChatParticipant = (sequelize) => {
  const model = sequelize.define('ChatParticipant', {
    chat_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,  
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,  
    }
  }, {
    tableName: 'chat_participants',
    timestamps: false, 
  });

  model.associate = function(models) {
    model.belongsTo(models.Chat, {
      foreignKey: 'chat_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    model.belongsTo(models.UserInfo, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return model;
};

export default ChatParticipant;
