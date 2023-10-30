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

const currentYear = new Date().getFullYear();
const updateUserSchema = Joi.object({
  body: Joi.object({
    fullname: Joi.string().min(3).max(30),
    gender: Joi.string().min(4).max(6),
    birthday: Joi.string().custom((value, helpers) => {
      const regex = new RegExp(
        `^(0[1-9]|[12][09]|3[01])\\/(0[1-9]|1[012])\\/(19[0-9]{2}|20[0-${
          currentYear.toString()[2]
        }][0-9]{1}|${currentYear - 1})$`
      );
      if (!regex.test(value)) {
        return helpers.error('any.invalid Birthday');
      }
      return value;
    }, 'Birthday validation'),
    description: Joi.string()
      .max(500)
      .regex(/^[a-zA-Z0-9\s]+$/),
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
