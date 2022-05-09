require('dotenv/config');
const errorTypes = require('./../enums/error.types')
const responseErrorService = require('./../services/response.error.service');
const service = require('../services/airport.service');

const log4js = require('../../config/log4js')
const log = log4js.getLogger("airport.controller.js");



exports.import = (req, res) => {
    try {
        service.import(req.body)
        .then(data => res.json(data))
        .catch(err => catchError(res, err, log));
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}


 exports.getAll = (req, res) => {
    try {
        service.getAirports(req)
        .then(data => res.json(data))
        .catch(err => catchError(res, err, log));
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}


 exports.getAirportById = (req, res) => {
    try {
        service.getAirportById(req.params.id)
        .then(data => res.json(data))
        .catch(err => catchError(res, err, log));
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}

exports.create = (req, res) => {
    try {
        service.create(req.body)
        .then(data => res.json(data))
        .catch(err => catchError(res, err, log));
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}

exports.update = (req, res) => {
    try {
        service.update(req.params.id,req.body)
        .then(data => res.json(data))
        .catch(err => catchError(res, err, log));
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}

exports.delete = (req, res) => {
    try {
        service.delete(req.params.id)
        .then(data => res.json(data))
        .catch(err => catchError(res, err, log));
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}


exports.getAirportThreats = (req, res) => {
    try {
        service.getAirportThreats(req.params.id)
        .then(data => res.json(data))
        .catch(err => catchError(res, err, log));
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}
