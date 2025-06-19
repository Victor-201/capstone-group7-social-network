import { DataTypes } from 'sequelize';

const Like = (sequelize) => {
  const model = sequelize.define('Like', {
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
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'post_id']
      }
    ]    
  });

  model.associate = (models) => {
    model.belongsTo(models.UserInfo, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    model.belongsTo(models.Post, {
      foreignKey: 'post_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return model;
};
export default Like;