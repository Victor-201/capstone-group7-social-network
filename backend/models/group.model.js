// Group model
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    privacy: {
      type: DataTypes.ENUM('public', 'private'),
      defaultValue: 'public',
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coverImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'cover_image'
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'creator_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'groups',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Group.associate = (models) => {
    Group.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' });
    Group.belongsToMany(models.User, { 
      through: 'group_members',
      foreignKey: 'group_id',
      otherKey: 'user_id',
      as: 'members'
    });
    Group.hasMany(models.Post, { foreignKey: 'group_id', as: 'posts' });
  };

  return Group;
};