'use strict'
const  Joi = require('@hapi/joi')

const changesTempPassword = Joi.object({
  username: Joi.string().required(),
  temp_password: Joi.string().required(),
  new_password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirm_password:  Joi.ref('new_password')
}).options({abortEarly:false})

const changesPassword = Joi.object({
  current_password: Joi.string().required(),
  new_password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirm_password:  Joi.ref('new_password')
}).options({abortEarly:false})


module.exports.changesTempPassword=changesTempPassword
module.exports.changesPassword=changesPassword