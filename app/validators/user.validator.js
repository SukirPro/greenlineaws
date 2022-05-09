const { body, validationResult,check } = require('express-validator')
const createUserValidationRules = () => {
  return [
    body('email').notEmpty().withMessage('email is required'),
    // userName required 
    body('username').notEmpty().withMessage('username is required'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules: createUserValidationRules,
  validate,
}