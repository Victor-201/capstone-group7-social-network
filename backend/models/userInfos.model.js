import { DataTypes } from 'sequelize';

const UserInfo = (sequelize) => {
  const model = sequelize.define('UserInfo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: DataTypes.STRING,
    bio: {
      type:DataTypes.TEXT,
      allowNull: true,
    },
    gender: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    location: {
      type:DataTypes.TEXT,
      allowNull: true,
    },
    hometown: {
      type:DataTypes.TEXT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    interestedUser: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, 
  {
    tableName: 'user_infos',
    timestamps: false
  });

  model.associate = (models) => {
    model.hasOne(models.UserAccount, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    model.belongsTo(models.UserMedia, {
      foreignKey: 'avatar',
      onDelete: 'SET NULL'
    });
    model.belongsTo(models.UserMedia, {
      foreignKey: 'cover',
      onDelete: 'SET NULL'
    });
    model.hasMany(models.UserMedia, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Post, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Comment, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Like, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.PostTag, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Friend, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Friend, {
      foreignKey: 'friend_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.PostMedia, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.RefreshToken, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Notification, {
      foreignKey: 'sender_id',
      as: 'SentNotifications',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Notification, {
      foreignKey: 'receiver_id',
      as: 'ReceivedNotifications',
      onDelete: 'CASCADE'
    });
    model.belongsToMany(models.UserInfo, {
      as: 'Followers',
      through: models.Follow,
      foreignKey: 'following_id',
      otherKey: 'follower_id',
      onDelete: 'CASCADE'
    });
    model.belongsToMany(models.UserInfo, {
      as: 'Followings',
      through: models.Follow,
      foreignKey: 'follower_id',
      otherKey: 'following_id',
      onDelete: 'CASCADE'
    });
    model.belongsToMany(models.Chat, {
      through: models.ChatParticipant,
      foreignKey: 'user_id',
      otherKey: 'chat_id',
      as: 'Chats',
      onDelete: 'CASCADE'
    });
    model.hasMany(models.Message, {
      foreignKey: 'sender_id',
      as: 'Messages',
      onDelete: 'CASCADE'
    });
  };
  return model;
};

export default UserInfo;
