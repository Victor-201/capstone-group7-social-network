const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UsersAccount = sequelize.define('UserAccount', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'user_infos',
        key: 'id'
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'deleting', 'prohibited'),
      defaultValue: 'active',
    },
    status_update_at: {
      type: DataTypes.DATE,
    }
  }, {
    tableName: 'user_account',
    timestamps: false,
  });

  UsersAccount.associate = (models) => {
    UsersAccount.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
  };

  return UsersAccount;
};
