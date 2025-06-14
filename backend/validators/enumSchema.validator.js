import Joi from 'joi';

export const EnumSchemas = {
  Friend: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
  }).unknown(true),
  Post: Joi.object({
    access_modifier: Joi.string().valid('public', 'private', 'friends').required(),
  }).unknown(true),
  Notification: Joi.object({
    type: Joi.string().valid('like', 'comment', 'follow', 'message').required(),
  }).unknown(true),
};
