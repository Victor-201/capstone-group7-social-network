import { DataTypes } from 'sequelize';
const Follow = (sequelize) => {
  const model = sequelize.define('Follow', {
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'follows',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['follower_id', 'following_id']
      }
    ]
  });

  model.associate = function(models) {
    model.belongsTo(models.UserInfo, {
      foreignKey: 'follower_id',
      as: 'Follower'
    });
    model.belongsTo(models.UserInfo, {
      foreignKey: 'following_id',
      as: 'Following'
    });
  };

  return model;
};
export default Follow;