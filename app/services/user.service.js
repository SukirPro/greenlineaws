var bcrypt = require('bcryptjs');
const db =
    module.exports.getSignupUserEntityModel = (data) => {
        return {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company,
            email: data.email,
            username: data.username,
            tempPassword: bcrypt.hashSync(data.tempPassword, 8)
        }
    }


module.exports.getUserResponseData = (data) => {

    const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        id: data.id,
    }

    return user
}

