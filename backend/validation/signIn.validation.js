import Joi from 'joi';

const signInValidate = Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]+$/).min(6).max(255).required(),
})
    .messages({
        'string.empty': '{{#label}} cannot be empty',
        'string.min': '{{#label}} should have a minimum length of {{#limit}}',
        'string.max': '{{#label}} should have a maximum length of {{#limit}}',
        'string.pattern.name': '{{#label}} must contain only alphanumeric characters',
    });
export default signInValidate;