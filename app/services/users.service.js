const db = require('../config/db_config/db.config');
const User = db.user;
const Op = db.Sequelize.Op;

const path = require('path');
const fs = require('fs');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');

const imagePath = "app/storage/users"
const credentialPath = "app/storage/credentials"
const credential = "credentials"

const log4js = require('../../config/log4js')
const log = log4js.getLogger("user.service.js");

/**
 * @returns {Object}
 */
exports.getUsers = (page, itemPerPage, query, status) => new Promise((resolve, reject) => {
    const { limit, offset } = getPagination(page, itemPerPage);
    let statusData = status ? status == 'active' ? true : false : null

    let queryFilter = query ? {
        [Op.or]: [
          { first_name: { [Op.like]: `%${query}%` } },
          { last_name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { username: { [Op.like]: `%${query}%` } }
        ]
      } : null
      let statusFilter = status ? { is_active: statusData } : null;
    let condition = { [Op.and]: [queryFilter, statusFilter] };

    User.findAndCountAll({
        attributes: ["id" ,"first_name", "last_name", "company", "email", "username", "is_active", "image"],
        include: [
            {
                model: db.role,
                as: 'roles',
                attributes: ["name", "description"],
            },
            {
                model: db.address,
                as: 'address',
                include: [
                    {
                        model: db.country,
                        as: 'country',
                        attributes: ['id', 'name']
                    }
                ]
            },
            {
                model: db.contact,
                as: 'contact'
            }
    ], limit, offset, order: [['id', 'DESC']],  where: condition })
        .then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

/**
 *
 * @param data
 * @param tempPassword
 * @param transaction
 * @returns {Promise<unknown>}
 */
exports.create = (data, tempPassword,  transaction) => new Promise((resolve, reject) => {
        User.create({
            ...data,
            password:bcrypt.hashSync(tempPassword, 8)
        }, {transaction: transaction})
            .then(doc => {
                doc.addRole(data.roles, {transaction: transaction}).then(async() => {
                    let filePath = path.join(`${credentialPath}/${doc.id}.txt`);
                    data  =  ` E-mail = ${doc.email}, \n Username = ${doc.username}, \n Password= ${tempPassword}` ;
                    if(await fs.existsSync(credentialPath) === false) {
                        await  fs.mkdirSync(credentialPath, { recursive: true }, (err) => {
                            if (err) throw err;
                          });
                      }

                    fs.writeFile(filePath, data, function(err){
                        if (err) throw err;
                         console.log("success");
                    });
                    doc["dataValues"]["credential"] = `http://${process.env.APP_ADDRESS}:${process.env.APP_PORT}/${credential}/${doc.id}.txt`
                    resolve({
                        data: doc,
                        transaction: transaction
                    })
                })
                .catch((err) => { log.error(err); transaction.rollback(); reject(err); });
            })
            .catch((err) => { log.error(err); transaction.rollback(); reject(err); });
    });




    /**
 *
 * @param data
 * @param tempPassword
 * @param transaction
 * @returns {Promise<unknown>}
 */
exports.createExternalUser = (data,  transaction) => new Promise((resolve, reject) => {
    User.create({
        ...data,
        password:bcrypt.hashSync(data.password, 8)
    }, {transaction: transaction})
        .then(doc => {
            doc.addRole(data.roles, {transaction: transaction}).then(async() => {
                let filePath = path.join(`${credentialPath}/${doc.id}.txt`);
                data  =  ` E-mail = ${doc.email}, \n Username = ${doc.username}, \n Password= ${data.password}` ;
                if(await fs.existsSync(credentialPath) === false) {
                    await  fs.mkdirSync(credentialPath, { recursive: true }, (err) => {
                        if (err) throw err;
                      });
                  }

                fs.writeFile(filePath, data, function(err){
                    if (err) throw err;
                     console.log("success");
                });
                doc["dataValues"]["credential"] = `http://${process.env.APP_ADDRESS}:${process.env.APP_PORT}/${credential}/${doc.id}.txt`
                resolve({
                    data: doc,
                    transaction: transaction
                })
            })
            .catch((err) => { log.error(err); transaction.rollback(); reject(err); });
        })
        .catch((err) => { log.error(err); transaction.rollback(); reject(err); });
});

/**
 *
 * @param id
 * @returns {Promise<unknown>}
 */
exports.show = (id) => new Promise((resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`))
    User
        .findOne({
            attributes: ["id" ,"first_name", "last_name", "company", "email", "username", "is_active", "image", "temp_password"],
            include: [
                {
                    model: db.role,
                    as: 'roles',
                    attributes: ["name", "description", "id"],
                    through:{
                        attributes: []
                    }
                },
                {
                    model: db.address,
                    as: 'address',
                    include: [
                        {
                            model: db.country,
                            as: 'country' ,
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: db.contact,
                    as: 'contact'
                }
            ], where: { id: id }
         })
        .then(async doc => {
            if(doc.temp_password != null){
                doc["dataValues"]["credential"] = `http://${process.env.APP_ADDRESS}:${process.env.APP_PORT}/${credential}/${doc.id}.txt`;
            }
            await delete doc['dataValues'].temp_password
            resolve(doc)
        })
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

/**
 *
 * @param id
 * @param data
 * @returns {Promise<unknown>}
 */
exports.update= (id, data, transaction) => new Promise((resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`))
    User.findOne({ where: {id: id}, transaction: transaction })
        .then(doc => {
            if (!doc) throw new Error('Invalid Id.')
            doc.update(data, {transaction: transaction}, { individualHooks: true }).then(() => {
                doc.setRoles([data.roles], {transaction: transaction}).then(() => {
                    resolve({
                        data: doc,
                        transaction: transaction
                    })
                })
            })
        })
        .catch(err => {
            transaction.rollback()
            log.error(err)
            reject(err)
        })
})

/**
 * 
 * @param {int} id 
 * @returns {String}
 */
exports.delete = (id,) => new Promise((resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`))

    User
        .destroy({
            where: { id: id }
        })
        .then(data => {
            if (!data) throw new Error('Invalid Id.')
            log.info(`User deleted having id:${id}`)
            resolve("User Successfully Deleted.")
        })
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

/**
 * 
 * @param {int} id 
 * @returns {String}
 */
exports.softDelete = (id,) => new Promise((resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`))
    User
        .findOne({
            where: { id: id }
        })
        .then(data => {
            if (!data) throw new Error('Invalid Id.')
            data.update({
                is_active : data.is_active == 1  ? 0 : 1
            }, { individualHooks: true })
            resolve("User Successfully Updated.")
        })
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

/**
 * @returns {Object}
 */
exports.search = (query) => new Promise((resolve, reject) => {
    var condition = query ? { userName: { [Op.like]: `%${query}%` } } : null;
    User.findAll({  limit:10, order: [['id', 'DESC']], where: condition })
        .then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})

/**
 *
 * @param id
 * @param data
 * @returns {Promise<unknown>}
 */
exports.imageUpload = (id, data) => new Promise(async (resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`))
    let file;
    let value;

    if (data == null) file = null
    else file = data.image

   if(file != null){
       let extension = path.extname(file.name)
       if (extension == '' ) extension = '.jpg'
       let fileName =  `${id}${extension}`
       let filePath = path.join(`${imagePath}/${fileName}`);

      if(await fs.existsSync(imagePath) === false) {
        await  fs.mkdirSync(imagePath, { recursive: true }, (err) => {
            if (err) throw err;
          });
      }

       await file.mv(filePath);
      value = fileName
   }else value = null

    User.update({ image: value },{ where: { id: id }}, {individualHooks: true}).then(() => {
      resolve("User Profile Image Successfully added.")
    }).catch(err => {log.error(err) ;reject(err)})

})

/**
 * 
 * @param {*} id 
 * @param {*} tempPassword 
 * @param {*} transaction 
 */
exports.userpasswordReset = (id, tempPassword) => new Promise((resolve, reject) => {
    User.findOne({where: {id: id}})
        .then(async doc =>{
            let filePath = path.join(`${credentialPath}/${doc.id}.txt`);
            data = ` E-mail = ${doc.email}, \n Username = ${doc.username}, \n Password= ${tempPassword}` ;
            if(await fs.existsSync(credentialPath) === false) {
                await  fs.mkdirSync(credentialPath, { recursive: true }, (err) => {
                    if (err) throw err;
                  });
              }

            fs.writeFile(filePath, data, function(err){
                if (err) throw err;
                 console.log("success");
            });
            doc["dataValues"]["credential"] = `http://${process.env.APP_ADDRESS}:${process.env.APP_PORT}/${credential}/${doc.id}.txt`;
            await doc.update({ password: bcrypt.hashSync(tempPassword, 8) })
            // await doc.update({ password: null ,temp_password:bcrypt.hashSync(tempPassword, 8)})
            resolve(doc)
        })
        .catch(err => { log.error(err); reject(err) })
})

exports.count = (field, value) => new Promise(async (resolve, reject) => {
    User.count({
        where:{[field]: value}
    }).then((count) => resolve(count))
    .catch(err => {
        log.error(err);
        reject(err)
    })
})