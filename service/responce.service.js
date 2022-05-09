
//SECTION Error Response
const customError = (res, message) => res.status(422).json({ status: false, message })
const notFound = res => res.status(404).json({ status: false, message: 'Endpoint not found.' })
const unexpectedError = (res) => res.status(500).json({ status: false, message: "500 - Internal Server Error" })


const forbiddenError = (res) => res.status(403).json({ status: false, message: "Forbidden" })
const unauthorizedError = (res) => res.status(401).send("Unauthorized")
//!SECTION 

//SECTION  Success Response
const successWithData = (res, data) => res.status(200).json({ status: true, data })
const download = (res, data) => res.download(data)
const successWithMessage = (res, message) => res.status(200).json({ status: false, message })
//!SECTION 

// validation Error Response
const validationError = (res, message, error) => res.status(422).json({ status: false, message, error })

global.response = { customError, notFound, unexpectedError, successWithData, unauthorizedError, forbiddenError, validationError, download, successWithMessage }
global.catchError = (res, err, log) => {
    log.error(err)
    res.status(500).send(err.message)
}

// Pagination
const _ = require('lodash');
const jwtDecode = require('jwt-decode')

global.getPagination = (page, size) => {
    const limit = size ? +size : 25;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
};

global.getPagingData = (items, page, size) => {
    const limit = size ? +size : 25;

    const { count: totalItems, rows: data } = items;
    const currentPage = page ? +page : 0;
    const lastPage = Math.ceil(totalItems / limit);
    const perPage = limit;
    const from = _.head(data).id
    const to = _.last(data).id

    const meta = {}
    meta['meta'] = {
        totalItems, lastPage, currentPage, perPage, from, to
    }
    return { data, ...meta };
};

global.relationPaginate = (data, limit, offset) => {
    const count = data.length;
    const rows = _.take(_.drop(data, offset), limit);
    return { count, rows }
}

global.getToken = (headers) => {
    const token = headers['x-access-token'] || headers['authorization']
    if (token && ['Token', 'Bearer'].includes(token.split(" ")[0])) {
        let doc = token.split(" ")[1]
        let decoded = jwtDecode(doc);
        return  decoded;
    }
    else return null
}

module.exports.response = response;