import sequelize from "../configs/database.config.js";
import UserAccount from "./userAccount.model.js";
import UserInfo from "./userInfos.model.js";
import ChatParticipant from "./chatParticipants.model.js";
import Chat from "./chats.model.js";
import Comment from "./Comments.model.js";
import Message from "./Messages.model.js";
import Post from "./Posts.model.js";
import Follow from "./Follows.model.js";
import Like from "./likes.model.js";
import Notification from "./Notifications.model.js";
import PostTag from "./postTag.model.js";
import UserMedia from "./userMedia.model.js";
import PostMedia from "./postMedia.model.js";
import Friend from "./Friends.model.js";
import RefreshToken from "./refreshTokens.modle.js";

const models = {
  UserAccount: UserAccount(sequelize),
  UserInfo: UserInfo(sequelize),
  ChatParticipant: ChatParticipant(sequelize),
  Chat: Chat(sequelize),
  Comment: Comment(sequelize),
  Message: Message(sequelize),
  Post: Post(sequelize),
  Follow: Follow(sequelize),
  Like: Like(sequelize),
  Notification: Notification(sequelize),
  PostTag: PostTag(sequelize),
  UserMedia: UserMedia(sequelize),
  PostMedia: PostMedia(sequelize),
  Friend: Friend(sequelize),
  RefreshToken: RefreshToken(sequelize),
};


Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});
export default models;