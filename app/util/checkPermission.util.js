const service = require('../services/auth.service')

exports.validatePermission = (key) => async (req, res, next) => {
   const policies =  await service.getPolicies(req.headers)

   next()
}