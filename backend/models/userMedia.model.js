const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserMedia = sequelize.define('UserMedia', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'user_infos',
        key: 'id'
      }
    },
    media_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    media_type: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'user_media',
    timestamps: false,
  });

  UserMedia.associate = (models) => {
    UserMedia.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
  };

  return UserMedia;
};
