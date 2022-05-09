'use strict'
const  Joi = require('@hapi/joi') 

const createRequest = Joi.object({
    date: Joi.date().required(),
    comments: Joi.string().required(),
}).options({abortEarly:false})

const updateRequest = Joi.object({
    date: Joi.date().required(),
    comments: Joi.string().required(),
}).options({abortEarly:false})

module.exports.historyDetailCreateRequest=createRequest
module.exports.historyDetailUpdateRequest=updateRequest
