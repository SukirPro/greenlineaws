'use strict'
const  Joi = require('@hapi/joi')

const createRequest = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    address:  Joi.object({
        address_line1: Joi.string().required(),
        address_line2: Joi.string().allow('', null),
        city: Joi.string().required(),
        postal_code: Joi.number().allow('', null),
        country_id : Joi.number().required()
    }),
    contact: Joi.object({
        telephone: Joi.string().regex(/^[A-Za-z0-9+]*$/).allow('', null),
        phone: Joi.string().regex(/^[A-Za-z0-9+]*$/).required(),
        email: Joi.string().email().allow('', null)
    })
}).options({abortEarly:false})

const updateRequest = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    address:  Joi.object({
        address_line1: Joi.string().required(),
        address_line2: Joi.string().allow('', null),
        city: Joi.string().required(),
        postal_code: Joi.number().allow('', null),
        country_id : Joi.number().required()
    }),
    contact: Joi.object({
        telephone: Joi.string().regex(/^[A-Za-z0-9+]*$/).allow('', null),
        phone: Joi.string().regex(/^[A-Za-z0-9+]*$/).required(),
        email: Joi.string().email().allow('', null)
    })
}).options({abortEarly:false})

module.exports.createRequest=createRequest
module.exports.updateRequest=updateRequest
