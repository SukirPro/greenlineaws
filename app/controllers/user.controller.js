require('dotenv/config');
const db = require('../config/db_config/db.config');
const jwt = require('jsonwebtoken');
const User = db.user;
const Op = db.Sequelize.Op;
const userSevice = require('../services/user.service.js');
const dbService = require('../services/db.service');
const bcrypt = require('bcryptjs');
const errorTypes = require('./../enums/error.types')
const responseErrorService = require('./../services/response.error.service');
const generator = require('generate-password');
// const emailService = require('../services/email.service');
// const { log } = require('async');
// const FiltersAndPagination = require('../request_models/filter.pagination')
const authController = require('../controllers/auth.controller');
// const Address = db.address;
// const Contact = db.contact;

// const db = require('../config/db_config/db.config');
const service = require('../services/users.service');
// const AddressService = require('../services/address.service');
// const ContactService = require('../services/contact.service');
// const emailService = require('../services/email.service');

const log4js = require('../../config/log4js')
const log = log4js.getLogger("user.controller.js");


/**
 * reset password
 * @param {*} req 
 * @param {*} res 
 */
exports.resetPassword = (req, res) => {
    try {
        const { resetLink, newPassword } = req.body

        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, (err, decoded) => {
            if (err) {
                responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, 'Token is not valid or expired', res);
            } else {
                User.update({ password: bcrypt.hashSync(newPassword, 8), temp_password: null }, {
                    where: { reset_link: resetLink }
                }).then(() => {
                    res.status(200).send('Your Password has beed changed');
                }).catch(error => {
                    // res.status(500).send('Reset password error');
                    responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);

                })
            }
        });
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}

exports.changeTempPassword = (req, res) => {
    try {
        const { tempPassword, password, username } = req.body
        User.findOne({
            where: {
                username: username
            }
        }).then((user) => {
            const passwordIsValid = bcrypt.compareSync(tempPassword, user.tempPassword);
            if (!passwordIsValid) {
                responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, 'Password doesn\'t match', res);
            } else {
                user.update({ password: bcrypt.hashSync(password, 8), tempPassword: null }).then(() => {
                    authController.signin(req, res)
                    // res.status(200).send('Your Password has beed changed');
                }).catch(error => {
                    responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
                })
            }
        }).catch(() => {
            responseErrorService.getErrorResponse(errorTypes.NOT_FOUND, 'User not found', res);
        })
    } catch (error) {
        responseErrorService.getErrorResponse(errorTypes.INSTERNAL_SERVER_ERROR, error, res);
    }
}

/**
 * Display the specified resource.
 *
 * @param {id} req
 * @param {Object} res
 */
exports.userpasswordReset = async (req, res) => {
    let tempPassword = generator.generate({ length: 8, uppercase: false });
    service.userpasswordReset(req.params.id, tempPassword)
        .then(async doc => {
            await emailService.notifyNewUserWithTemporaryPassword(doc, tempPassword, res)
            res.json(doc)
        })
        .catch(err => catchError(res, err, log))
}


/**
 * Display a listing of the resource
 * 
 * @param {*} req 
 * @param {Object} res 
 */
exports.getAll = async (req, res) => {
    const {page, size, query, status } = req.query;
    service.getUsers(page, size, query, status)
        .then(data => {
            if(data.rows.length > 0){
                res.send(getPagingData(data, page, size))
            }else{
                res.status(200).json({ status: true, message: "No record found." })
            } 
        })
        .catch(err => catchError(res, err, log))
}

/**
 * Display the specified resource.
 *
 * @param {id} req
 * @param {Object} res
 */
exports.create = async (req, res) => {
    const userCountWithUserName = await service.count( 'username', req.body.username)
        .then((count) => { return count; })
        .catch(() => { return null; })

    const userCountWithEmail = await service.count('email', req.body.email )
        .then((count) => { return count; })
        .catch(() => { return null; })

    // check the email
    const errors = [];
    if (userCountWithEmail && userCountWithEmail != 0) {
        errors.push({'email': "Email already exists"});
    }
    // check the username
    if (userCountWithUserName && userCountWithUserName != 0) {
        errors.push({ 'username': 'Username already exists' });
    }
    // send error if the username or email already exists
    if (errors.length > 0) {
        let data = {};
        errors.forEach((element) => {
            data[Object.keys(element)[0]] = element[Object.keys(element)[0]];
        });
        res.status(500).send({ status: 500, error: data})
        return;
    }

    const transaction = await db.sequelize.transaction();
    let tempPassword = generator.generate({ length: 8, uppercase: false });

    service.create(req.body, tempPassword, transaction)
        .then(async (doc) => {
            await emailService.notifyNewUserWithTemporaryPassword(doc.data, tempPassword, res)
            // if(req.body.address){
            //   await  AddressService.create(doc.data.id, 'user', req.body.address, doc.transaction)
            // }
            // if(req.body.contact){
            //     await ContactService.create(doc.data.id, 'user', req.body.contact, doc.transaction)
            // }
            transaction.commit()
            res.json(doc.data)
        })
        .catch(err => catchError(res, err, log))
}



/**
 * Display the specified resource.
 *
 * @param {id} req
 * @param {Object} res
 */
 exports.createExternalUser = async (req, res) => {
    const userCountWithUserName = await service.count( 'username', req.body.username)
        .then((count) => { return count; })
        .catch(() => { return null; })

    const userCountWithEmail = await service.count('email', req.body.email )
        .then((count) => { return count; })
        .catch(() => { return null; })

    // check the email
    const errors = [];
    if (userCountWithEmail && userCountWithEmail != 0) {
        errors.push({'email': "Email already exists"});
    }
    // check the username
    if (userCountWithUserName && userCountWithUserName != 0) {
        errors.push({ 'username': 'Username already exists' });
    }
    // send error if the username or email already exists
    if (errors.length > 0) {
        let data = {};
        errors.forEach((element) => {
            data[Object.keys(element)[0]] = element[Object.keys(element)[0]];
        });
        res.status(500).send({ status: 500, error: data})
        return;
    }

    const transaction = await db.sequelize.transaction();
    let tempPassword = generator.generate({ length: 8, uppercase: false });

    service.createExternalUser(req.body, transaction)
        .then(async (doc) => {
            await emailService.notifyNewUserWithTemporaryPassword(doc.data, tempPassword, res)
            // if(req.body.address){
            //   await  AddressService.create(doc.data.id, 'user', req.body.address, doc.transaction)
            // }
            // if(req.body.contact){
            //     await ContactService.create(doc.data.id, 'user', req.body.contact, doc.transaction)
            // }
            transaction.commit()
            res.json(doc.data)
        })
        .catch(err => catchError(res, err, log))
}


/**
 * Display the specified resource.
 *
 * @param {id} req
 * @param {Object} res
 */
exports.show = async (req, res) => service.show(req.params.id)
    .then(data => res.json(data))
    .catch(err => catchError(res, err, log))

/**
 * Update the specified resource in storage
 *
 * @param {id} req
 * @param {String} res
 */
exports.edit = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    service.update(req.params.id, req.body, transaction)
        .then(async (doc) =>  {
            // if(req.body.address){
            //     await AddressService.delete(doc.data.id, 'user', doc.transaction)
            //     await  AddressService.create(doc.data.id, 'user', req.body.address, doc.transaction)
            // }
            // if(req.body.contact){
            //     await ContactService.delete(doc.data.id, 'user',doc.transaction)
            //     await ContactService.create(doc.data.id, 'user', req.body.contact, doc.transaction)
            // }
            transaction.commit()
            response.successWithData(res, "User Successfully Updated")
        })
        .catch(err => {
            transaction.rollback()
            catchError(res, err, log)
        })
}
/**
 *  Remove the specified resource from storage.
 * 
 * @param {id} req 
 * @param {String} res 
 */
exports.delete = async (req, res) => service.delete(req.params.id)
    .then(data =>response.successWithData(res, data))
    .catch(err => catchError(res, err, log));

/**
 * 
 * @param {id} req 
 * @param {string} res 
 */
exports.softDelete = async (req, res) => service.softDelete(req.params.id)
    .then(data =>response.successWithData(res, data))
    .catch(err => catchError(res, err, log));

/**
* 
* @param {query} req 
* @param {object} res 
*/
exports.search = async (req, res) => {
    service.search(req.query.query)
        .then(data => response.successWithData(res, data))
        .catch(err => catchError(res, err, log))
}

exports.imageUpload = async (req, res) => service.imageUpload(req.params.id, req.files)
    .then(data => response.successWithData(res, data))
    .catch(err => catchError(res, err, log));