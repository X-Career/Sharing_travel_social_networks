const Joi = require('joi');

const middlewareValidate = (schema) => {
  return (req, res, next) => {
    // validate data in body, params, query
    const { body, params, query } = req;
    const { error } = schema.validate({ body, params, query });

    // const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details);
    }
    next();
  };
};

const updateUserSchema = Joi.object({
  body: Joi.object({
    avatar: Joi.string(),
    fullname: Joi.string().max(30),
    gender: Joi.string().max(6),
    birthday: Joi.string().custom((value, helpers) => {
      const currentYear = new Date().getFullYear();
      const regex = new RegExp(
        `^((0[1-9]|[12][09|3[01])\\/(0[1-9]|1[012])\\/((19|20)[0-9]{2}|${currentYear}))$`
      );

      if (!regex.test(value)) {
        return helpers.error('any.invalid Birthday');
      }
      return value;
    }, 'Birthday validation'),
    description: Joi.string()
      .max(500)
      .regex(/^[\/\d\\\p{Alphabetic}\p{Punctuation}\p{White_Space}]+$/u),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

const updatePasswordSchema = Joi.object({
  body: Joi.object({
    newPassword: Joi.string()
      .min(7)
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/),
    repeat_newPassword: Joi.ref('newPassword'),
    oldPassword: Joi.string()
      .min(7)
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

module.exports = {
  middlewareValidate,
  updateUserSchema,
  updatePasswordSchema,
};
