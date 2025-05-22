import { DataTypes } from 'sequelize';

const UserMedia = (sequelize) => {
  const model = sequelize.define('UserMedia', {
    media_id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    media_type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
    },
    image_type:{
      type: DataTypes.ENUM('cover', 'avatar'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'user_media',
    timestamps: false,
  });

  model.associate = (models) => {
    model.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
  };

  return model;
};

export default UserMedia;