const db = require('../config/db_config/db.config');
const Passenger = db.passenger;
const log4js = require('../../config/log4js')
const log = log4js.getLogger("passenger.service.js");


exports.import = (data) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    db.passenger.destroy({ truncate: { cascade: false } })
    .then(doc1 => {
        transaction.commit();
        db.passenger.bulkCreate(data, {
        })
            .then(doc => {
                resolve({
                    data: doc
                })
            })
            .catch((err) => { log.error(err); reject(err); });
    })
    .catch((err) => { log.error(err); reject(err); });

    // db.passenger.bulkCreate(data)
    //     .then(doc => {
    //         resolve({
    //             data: doc
    //         })
    //     })
    //     .catch((err) => { log.error(err); reject(err); });
});


exports.getPassengers = (req) => new Promise((resolve, reject) => {
    Passenger.findAll({}).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.getPassengerById = (id) => new Promise((resolve, reject) => {

    Passenger.findAll({ where: { id: id } }).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.create = (data) => new Promise((resolve, reject) => {
    db.passenger.create(data)
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
        db.passenger.update(data, {
            where: { id: id }, individualHooks: true
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                resolve('Passenger Successfully Updated.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });

exports.delete = (id) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));

        db.passenger.destroy({
            where: { id: id },
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                log.info(`Passenger deleted having id:${id}`);
                resolve('Passenger Successfully Deleted.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });