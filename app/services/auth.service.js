const db = require('../config/db_config/db.config');
const User = db.user;
const userLogin = db.userLogin;

const JWT = require('../util/jwt')
// const emailService = require('../services/email.service');

const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwtDecode = require('jwt-decode')

const log4js = require('../../config/log4js')
const log = log4js.getLogger("auth.service.js");

// const siteSettingService = require('./setting/siteSetting')

const fs = require('fs')
const credentialPath = "app/storage/credentials"

/**
 * @param {array} data 
 */
exports.authenticate = (session, data, ip) => new Promise((resolve, reject) => {
    if (!data.username) reject(new Error(`UserName or E-mail can't be empty`))
    if (!data.password) reject(new Error(`Password can't be empty`))

    var criteria = (data.username.indexOf('@') === -1) ? { username: data.username, is_active: true } : { email: data.username, is_active: true };

    User
        .findOne({
            where: criteria
        }).then(doc => {
            if (!doc) throw new Error("No User Found")
            if (doc.temp_password) {
                const temPasswordIsValid = bcrypt.compareSync(data.password, doc.temp_password);
                if (!temPasswordIsValid) {
                    reject(new Error(`Invalid password!!`))
                }
                resolve({ redirectLink: 'change-password' })
            }
            const passwordIsValid = bcrypt.compareSync(data.password, doc.password);
            if (!passwordIsValid) reject(new Error(`Invalid password!!`))

            const id = `${doc.id}`
            const email = `${doc.email}`

            if (cache.has(id)) {
                const { accessToken, refreshToken } = cache.get(id)
                resolve({ accessToken, refreshToken })
            } else {
                new JWT(doc.email, doc.id).generate((err, accessToken, refreshToken) => {
                    if (err) throw err
                    cache.set(id, { accessToken, refreshToken, email }, 43200)
                    session.user = doc;
                    userLogin.create({
                        user_id: doc.id,
                        ip_address: ip,
                        login: data.username,
                        time: moment()
                    })
                    resolve({ accessToken, refreshToken })
                })
            }
        })
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

/**
 * @returns {Object}
 */
exports.refreshToken = (headers) => new Promise((resolve, reject) => {
    try {
        const token = getToken(headers)
        const key = cache.keys().find(key => cache.get(key).refreshToken === token)

        if (key === undefined) throw new Error("Invalid Refresh Token")
        else {
            const { email } = cache.get(key)
            new JWT(email, key).refresh(token, (err, accessToken) => {
                if (err) throw err
                cache.set(key, { accessToken, refreshToken: token, email })
                resolve({ accessToken })
            })
            resolve({})
        }
    } catch (error) {
        log.error(error)
        reject(error)
    }
})

/**
 * @returns {Object}
 */
exports.user = (headers) => new Promise((resolve, reject) => {
    const token = getToken(headers)
    const decoded = jwtDecode(token);
    User
        .findOne({
            where: { id: decoded.key }
        })
        .then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

// /**
//  * @returns {Object}
//  */
// exports.forgetPassword = (email) => new Promise(async (resolve, reject) => {
//     const emailSettings = await siteSettingService.handle();
//     const frontEndUrl = emailSettings.url ? emailSettings.url : 'http://localhost:8081'
//     if (!email) reject(new Error(`E-mail can't be empty`))
//     User
//         .findOne({
//             where: { email: email }
//         })
//         .then(doc => {
//             if (!doc) throw new Error("User with this email doesn\'t exist");
//             new JWT(doc.email, doc.id).forgetPassword((err, token, resetLink) => {
//                 let url = `${frontEndUrl}${resetLink}`;
//                 if (err) throw err
//                 doc.update({ reset_link: token })
//                     .then(async () => {
//                         const isEmailSent = await emailService.senResetPasswordLink(email, url);
//                         resolve(isEmailSent)
//                     })
//                     .catch(err => {
//                         log.error(err)
//                         reject(err)
//                     })
//             })
//         })
//         .catch(err => {
//             log.error(err)
//             reject(err)
//         })
// })


/**
 * 
 * @param {*} data 
 */
exports.changesTempPassword = (data) => new Promise((resolve, reject) => {
    User
        .findOne({ where: { username: data.username } })
        .then(async doc => {
            if (!doc) throw new Error("No User Found.")
            const ValidPassword = await bcrypt.compareSync(data.temp_password, doc.temp_password);
            if (ValidPassword === false) reject(new Error(`Old password isn't valid`))
            doc.update({
                password: bcrypt.hashSync(data.new_password, 8),
                temp_password: null
            }).then(() => {
                fs.unlinkSync(`${credentialPath}/${doc.id}.txt`)
                resolve('password successfully Updated.')
            })
        })
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

/**
 * 
 * @param {*} data 
 * @param {*} headers 
 */
exports.changesPassword = (data, headers) => new Promise((resolve, reject) => {
    const token = getToken(headers)
    const decoded = jwtDecode(token);
    User
        .findByPk(decoded.key)
        .then(async doc => {
            if (!doc) throw new Error("No User Found.")
            const ValidPassword = await bcrypt.compareSync(data.current_password, doc.password);
            if (ValidPassword === false) reject(new Error(`Old password isn't valid`))
            doc.update({
                password: bcrypt.hashSync(data.new_password, 8),
            }).then(resolve('password successfully Updated.'))
        })
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

const getToken = (headers) => {
    const token = headers['x-access-token'] || headers['authorization']
    if (token && ['Token', 'Bearer'].includes(token.split(" ")[0])) return token.split(" ")[1]
    else return null
}