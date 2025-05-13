import Joi from 'joi';

const registationValidate = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    birthdate: Joi.date().less('now').required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    userName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]+$/).min(6).max(255).required(),
    confirmPassword: Joi.string().min(6).max(255).required().valid(Joi.ref('password')),
})
    .with('password', 'confirmPassword')
    .messages({
        'string.empty': '{{#label}} cannot be empty',
        'any.required': '{{#label}} is required',
        'string.pattern.base': '{{#label}} must contain only alphanumeric characters',
        'string.min': '{{#label}} should have a minimum length of {{#limit}}',
        'string.max': '{{#label}} should have a maximum length of {{#limit}}',
        'string.pattern.name': '{{#label}} must contain only alphanumeric characters',
        'any.only': '{{#label}} does not match with password',
        'string.email': '{{#label}} must be a valid email address',
        'any.only': '{{#label}} must be one of [male, female, other]',
    });

export default registationValidate;