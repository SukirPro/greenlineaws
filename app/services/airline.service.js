const db = require('../config/db_config/db.config');
const Airline = db.airline;
const log4js = require('../../config/log4js')
const log = log4js.getLogger("airline.service.js");


exports.import = (data) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    db.airline.destroy({ truncate: { cascade: false } })
    .then(doc1 => {
        transaction.commit();
        db.airline.bulkCreate(data, {
        })
            .then(doc => {
                resolve({
                    data: doc
                })
            })
            .catch((err) => { log.error(err); reject(err); });
    })
    .catch((err) => { log.error(err); reject(err); });

    // db.airline.bulkCreate(data)
    //     .then(doc => {
    //         resolve({
    //             data: doc
    //         })
    //     })
    //     .catch((err) => { log.error(err); reject(err); });
});


exports.getAirlines = (req) => new Promise((resolve, reject) => {
    Airline.findAll({}).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.getAirlineById = (id) => new Promise((resolve, reject) => {

    Airline.findAll({ where: { id: id } }).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.create = (data) => new Promise((resolve, reject) => {
    db.airline.create(data)
        .then(doc => {
            resolve({
                data: doc
            })
        })
        .catch((err) => { log.error(err); reject(err); });
});


exports.update = (id, data) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));
        db.airline.update(data, {
            where: { id: id }, individualHooks: true
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                resolve('Airline Successfully Updated.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });

exports.delete = (id) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));

        db.airline.destroy({
            where: { id: id },
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                log.info(`Airline deleted having id:${id}`);
                resolve('Airline Successfully Deleted.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });