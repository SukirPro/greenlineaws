

const service = require('../services/auth.service')
const log4js = require('../../config/log4js')
const log = log4js.getLogger("auth.controller.js");

exports.authenticate = async (req, res) => service.authenticate(req.session ,req.body, req.connection.remoteAddress)
    .then(data => res.json(data))
    .catch(err => catchError(res, err, log));
    
exports.refreshToken = (req, res) => service.refreshToken(req.headers)
    .then(data => res.json(data))
    .catch(err => catchError(res, err, log))
    
exports.forgetPassword = async (req, res) => service.forgetPassword(req.body.email)
    .then(data =>  response.successWithData(res, `Reset link has been sent to ${req.body.email}`))
    .catch(err => catchError(res, err, log));

exports.changesTempPassword = async (req, res) => service.changesTempPassword(req.body)
    .then(doc => response.successWithData(res, doc))
    .catch(err => catchError(res, err, log));

exports.changesPassword = async (req, res) => service.changesPassword(req.body, req.headers)
    .then(doc => response.successWithData(res, doc))
    .catch(err => catchError(res, err, log));

exports.user = async (req, res) => service.user(req.headers)
    .then(data => res.json({
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        image: data.image,
        email: data.email,
        username: data.username,
    }))
    .catch(err => catchError(res, err, log));