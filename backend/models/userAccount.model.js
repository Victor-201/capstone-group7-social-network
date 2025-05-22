import { DataTypes } from 'sequelize';

const UserAccount = (sequelize) => {
  const model = sequelize.define('UserAccount', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    otp_code: {
      type: DataTypes.STRING,
    },
    otp_expiry: {
      type: DataTypes.DATE,
    },
    role : {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active','suspended', 'deleted'),
      defaultValue: 'active',
    },
    status_update_at: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'user_account',
    timestamps: false,
  });

  model.associate = (models) => {
    model.belongsTo(models.UserInfo, { foreignKey: 'id' });
  };
    return model;
};

export default UserAccount;
