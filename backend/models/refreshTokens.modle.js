import { DataTypes } from "sequelize";

const RefreshToken = (sequelize) => {
  const model = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'refresh_tokens',
    timestamps: false,
  });
    model.associate = (models) => {
        model.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
    };
    return model;
}
export default RefreshToken;
