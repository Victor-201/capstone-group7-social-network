const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Follow = sequelize.define('Follow', {
    follower_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    following_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Follows',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['follower_id', 'following_id']
      }
    ]
  });

  Follow.associate = function(models) {
    Follow.belongsTo(models.UserInfo, {
      foreignKey: 'follower_id',
      as: 'Follower'
    });
    Follow.belongsTo(models.UserInfo, {
      foreignKey: 'following_id',
      as: 'Following'
    });
  };

  return Follow;
};
