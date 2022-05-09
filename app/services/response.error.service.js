const errorTypes = require('./../enums/error.types')

module.exports.getErrorResponse = (errorType, data, res) => {
    switch (errorType) {
        case errorTypes.NOT_FOUND:
            gerNotFoundError(data, res, data);
            break;
        case errorTypes.UNAUTHORIZED:
            gerUnathorizedError(data, res, data);
            break;
        case errorTypes.INSTERNAL_SERVER_ERROR:
            gerInternalServerError(data, res, data);
            break;
        case errorTypes.FORBIDDEN:
            gerForbiddentError(data, res, data);
            break;
        case errorTypes.BAD_REQUEST:
            gerBadRequestError(data, res, data);
            break;
        default:
            break;
    }
}

function gerNotFoundError(data, res, errors) {
    res.status(404).send(getError(404, data, errors))
}

function gerUnathorizedError(data, res, errors) {
    res.status(401).send(getError(401, data, errors))
}

function gerInternalServerError(data, res, errors) {
    res.status(500).send(getError(500, data, errors))
}

function gerForbiddentError(data, res, errors) {
    res.status(403).send(getError(403, data, errors))
}

function gerBadRequestError(data, res, errors) {
    res.status(400).send(getError(400, data, errors))
}


function getError(status, title, detail) {
    return {
        status: status,
        title: title,
        detail: detail
    }
}

