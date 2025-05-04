// models/Like.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      references: {
        model: 'posts',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'user_infos',
        key: 'id',
      },
    },
  }, {
    tableName: 'likes',
    timestamps: false,
  });

  Like.associate = (models) => {
    Like.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
    Like.belongsTo(models.Post, { foreignKey: 'post_id' });
  };

  return Like;
};
