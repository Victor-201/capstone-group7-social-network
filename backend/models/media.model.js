const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Media = sequelize.define('Media', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'post_id',
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('image', 'video', 'document'),
      defaultValue: 'image'
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    thumbnailUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'thumbnail_url'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'media',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Media.associate = (models) => {
    Media.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
  };

  return Media;
};