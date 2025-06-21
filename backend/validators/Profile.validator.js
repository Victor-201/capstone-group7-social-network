import Joi from "joi";

export const updateProfileSchema = Joi.object({
  job: Joi.string().max(255).allow(null, ""),
  education: Joi.string().max(255).allow(null, ""),
  location: Joi.string().max(255).allow(null, ""),
  hometown: Joi.string().max(255).allow(null, ""),
  relationship_status: Joi.string()
    .valid("single", "in_a_relationship", "engaged", "married", "divorced", "widowed")
    .allow(null, "")
});
