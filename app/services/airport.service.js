const db = require('../config/db_config/db.config');
const Airport = db.airport;
const log4js = require('../../config/log4js')
const log = log4js.getLogger("airport.service.js");


exports.import = (data) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    db.airport.destroy({ truncate: { cascade: false } })
    .then(doc1 => {
        transaction.commit();
        db.airport.bulkCreate(data, {
        })
            .then(doc => {
                resolve({
                    data: doc
                })
            })
            .catch((err) => { log.error(err); reject(err); });
    })
    .catch((err) => { log.error(err); reject(err); });

    // db.airport.bulkCreate(data)
    //     .then(doc => {
    //         resolve({
    //             data: doc
    //         })
    //     })
    //     .catch((err) => { log.error(err); reject(err); });
});


exports.getAirports = (req) => new Promise((resolve, reject) => {
    Airport.findAll({}).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.getAirportById = (id) => new Promise((resolve, reject) => {

    Airport.findAll({ where: { id: id } }).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.create = (data) => new Promise((resolve, reject) => {
    db.airport.create(data)
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
        db.airport.update(data, {
            where: { id: id }, individualHooks: true
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                resolve('Airport Successfully Updated.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });

exports.delete = (id) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));

        db.airport.destroy({
            where: { id: id },
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                log.info(`Airport deleted having id:${id}`);
                resolve('Airport Successfully Deleted.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });


    exports.getAirportThreats = (id) => new Promise((resolve, reject) => {

        Airport.findAll({ where: { id: id } }).then(resolve)
            .catch(err => {
                log.error(err)
                reject(err)
            })
    })