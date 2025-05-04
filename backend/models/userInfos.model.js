module.exports = (sequelize, DataTypes) => {
    const UserInfo = sequelize.define('UserInfo', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      full_name: DataTypes.STRING,
      bio: DataTypes.TEXT,
      birthdate: DataTypes.DATE,
      gender: DataTypes.STRING,
      favourite: DataTypes.STRING,
      interestedUser: DataTypes.STRING
    }, {
      tableName: 'UserInfos',
      timestamps: false
    });
  
    UserInfo.associate = models => {
      UserInfo.hasOne(models.UserAccount, { foreignKey: 'user_id' });
      UserInfo.hasMany(models.UserMedia, { foreignKey: 'user_id' });
      UserInfo.hasMany(models.Post, { foreignKey: 'user_id' });
      UserInfo.hasMany(models.Comment, { foreignKey: 'user_id' });
      UserInfo.hasMany(models.Like, { foreignKey: 'user_id' });
      UserInfo.hasMany(models.Notification, { foreignKey: 'sender_id' });
      UserInfo.hasMany(models.Notification, { foreignKey: 'receiver_id' });
      UserInfo.belongsToMany(models.UserInfo, {
        as: 'Followers',
        through: models.Follow,
        foreignKey: 'following_id',
        otherKey: 'follower_id'
      });
      UserInfo.belongsToMany(models.UserInfo, {
        as: 'Followings',
        through: models.Follow,
        foreignKey: 'follower_id',
        otherKey: 'following_id'
      });
    };
  
    return UserInfo;
  };
  