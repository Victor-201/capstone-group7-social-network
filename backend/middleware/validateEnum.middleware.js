import { EnumSchemas } from '../validators/enumSchema.validator.js';

export const validateEnum = (modelName) => {
  return (req, res, next) => {
    const schema = EnumSchemas[modelName];
    if (!schema) {
      return res.status(500).json({ message: `No enum validator for model: ${modelName}` });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ message: 'Enum validation error', errors: messages });
    }

    next();
  };
};
