const jwt = require('jsonwebtoken')

const privateKey = process.env.privateKey
const refreshKey = process.env.refreshKey
const resetPasswordKey = process.env.RESET_PASSWORD_KEY

class JWT {

    constructor(email, id) {
        this.email = email
        this.id = id
    }

    static verify (token) {
        try {
            const decode = jwt.verify(token, privateKey)
            if (!decode.key)
                throw new Error('Invalid JWT')
            return decode.key
        } catch (error) {
            throw error
        }
    }

    generate (callback) {
        const token = jwt.sign({ email: this.email, key: this.id }, privateKey, { expiresIn: '24h' })
        const refreshToken = jwt.sign({ email: this.email }, refreshKey, { expiresIn: '24h' })
        callback(undefined, token, refreshToken)
    }

    refresh (token, callback) {
        try {
            const decode = jwt.verify(token, refreshKey)
            if (!decode.email) throw new Error('Invalid JWT')
            const newToken = jwt.sign({ email: this.email, key: this.id }, privateKey, { expiresIn: '1h' })
            callback(undefined, newToken)
        } catch (error) {
            callback(error, undefined)
        }
    }

    forgetPassword(callback) {
        const token = jwt.sign({ email: this.email, key: this.id }, resetPasswordKey, { expiresIn: '1h' })
        const resetLink = '/reset_password?token=' + token;
        callback(undefined, token, resetLink)
    }   
}

module.exports = JWT;