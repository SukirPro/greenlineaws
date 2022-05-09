const express = require('express');
const router = express.Router();
const authController = require('.././../../controllers/auth.controller');

const { validateToken, validateBodyWithToken } =require('../../../util/validator.util')
const { changesTempPassword , changesPassword}= require('../../../validators/auth.validator')

router.post('/login', authController.authenticate);
router.get('/user', validateToken(), authController.user);
router.post('/refresh', authController.refreshToken);
router.post('/forget-password', authController.forgetPassword);
router.post('/changes-temp-password', validateBodyWithToken(changesTempPassword), authController.changesTempPassword);
router.post('/changes-password', validateBodyWithToken(changesPassword), authController.changesPassword);

module.exports = router;