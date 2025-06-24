import Joi from 'joi';

export const EnumSchemas = {
  Friend: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
  }).unknown(true),
  Post: Joi.object({
    access_modifier: Joi.string().valid('public', 'private', 'friends').required(),
  }).unknown(true),
  Notification: Joi.object({
    type: Joi.string().valid('post', 'comment', 'like', 'friend_request', 'message', 'friend_response', 'reply_comment').required(),
  }).unknown(true),
};
