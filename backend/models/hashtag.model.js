const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Hashtag = sequelize.define('Hashtag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'hashtags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Hashtag.associate = (models) => {
    Hashtag.belongsToMany(models.Post, { 
      through: 'post_hashtags', 
      foreignKey: 'hashtag_id', 
      otherKey: 'post_id',
      as: 'posts' 
    });
  };

  return Hashtag;
};