
'use strict'
const Joi = require('@hapi/joi')

const importAirlines = Joi.array().items(
    Joi.object({
        company_name: Joi.string().required(),
        two_letter_code: Joi.string().required(),
        country: Joi.string().required()
    })
).options({ abortEarly: false })


const createValidation =
    Joi.object({
        company_name: Joi.string().required(),
        two_letter_code: Joi.string().required(),
        country: Joi.string().required()
    }).options({ abortEarly: false })

const updateValidation =
    Joi.object({
        company_name: Joi.string().required(),
        two_letter_code: Joi.string().required(),
        country: Joi.string().required()
    }).options({ abortEarly: false })


module.exports.importAirlines = importAirlines
module.exports.createValidation = createValidation
module.exports.updateValidation = updateValidation

