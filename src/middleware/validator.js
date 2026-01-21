const Joi = require('joi');

const leadSchema = Joi.object({
    lead: Joi.object({
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        street: Joi.string().required(),
        zipcode: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        city: Joi.string().required()
    }).unknown(true),
    questions: Joi.object().required()
}).unknown(true);

const validateLead = (req, res, next) => {
    const { error } = leadSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input format from Endpoint 1',
            details: error.details[0].message
        });
    }
    next();
};

module.exports = { validateLead };