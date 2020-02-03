// eslint-disable-next-line consistent-return
const Joi = require('joi');

exports.validateImageType = (req, res, next) => {
  const { file } = req;

  // This permits users to validate, when an image is not been uploaded.
  if (!file) return next();
  const allowedTypes = ['image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) return res.status(400).json({ message: 'Images must eiher be png or jpg' });
  return next();
};

exports.validateBody = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).max(300)
      .required(),
    description: Joi.string().min(3).max(300),
    location: Joi.string().required(),
    city: Joi.string().min(2).max(100),
    price: Joi.string().max(12),
    eventType: Joi.string().min(3).max(50),
    source: Joi.string().min(3).max(300),
    imageUrl: Joi.string(),
    country: Joi.string(),
    eventDate: Joi.date(),
    author: Joi.string(),
    scrapedEventId: Joi.string(),
  });

  const { error } = Joi.validate(req.body, schema);
  const validError = error == null;
  if (!validError) return res.status(422).json({ message: error.details[0].message });
  return next();
};
