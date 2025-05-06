const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    tableName: 'likes',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'post_id']
      }
    ]    
  });

  Like.associate = (models) => {
    Like.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
    Like.belongsTo(models.Post, { foreignKey: 'post_id' });
  };

  return Like;
};
