const db = require('../config/db_config/db.config');
const Aircraft = db.aircraft;
const log4js = require('../../config/log4js')
const log = log4js.getLogger("aircraft.service.js");

exports.import = (data) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();

    db.aircraft.destroy({ truncate: { cascade: false } })
    .then(doc1 => {
        transaction.commit();
        db.aircraft.bulkCreate(data, {
        })
            .then(doc => {
                resolve({
                    data: doc
                })
            })
            .catch((err) => { log.error(err); reject(err); });
    })
    .catch((err) => { log.error(err); reject(err); });

    // db.aircraft.bulkCreate(data)
    //     .then(doc => {
    //         resolve({
    //             data: doc
    //         })
    //     })
    //     .catch((err) => { log.error(err); reject(err); });
});


exports.getAircrafts = (req) => new Promise((resolve, reject) => {
    Aircraft.findAll({}).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.getAircraftById = (id) => new Promise((resolve, reject) => {

    Aircraft.findAll({ where: { id: id } }).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.create = (data) => new Promise((resolve, reject) => {
    db.aircraft.create(data)
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
        db.aircraft.update(data, {
            where: { id: id }, individualHooks: true
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                resolve('Aircraft Successfully Updated.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });

exports.delete = (id) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));

        db.aircraft.destroy({
            where: { id: id },
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                log.info(`Aircraft deleted having id:${id}`);
                resolve('Aircraft Successfully Deleted.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });