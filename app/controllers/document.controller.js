const service = require('../services/document.service')
const path = require('path');

const log4js = require('../../config/log4js')
const log = log4js.getLogger("document.controller.js");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getAll = async (req, res) => service.getDocuments(req.params.model, req.params.modelId)
    .then(data => response.successWithData(res, data))
    .catch(err => catchError(res, err, log));

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.upload = async (req, res) => service.uploadDocument(req.params.model, req.params.modelId, req.files, req.headers)
    .then(data => response.successWithData(res, data))
    .catch(err => catchError(res, err, log));

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.download = async (req, res) => service.downloadDocument(req.params.id)
    .then(data => {
        response.successWithData(res, data['dataValues']['path'])
    })
    .catch(err => catchError(res, err, log));

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => service.deleteDocument(req.params.id)
    .then(data => response.successWithData(res, data))
    .catch(err => catchError(res, err, log));
