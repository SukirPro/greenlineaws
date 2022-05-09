const db = require('../config/db_config/db.config');
const Threat = db.threat;
const log4js = require('../../config/log4js')
const log = log4js.getLogger("threat.service.js");

exports.import = (data) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    db.threat.destroy({ truncate: { cascade: false } })
    .then(doc1 => {
        transaction.commit();
        db.threat.bulkCreate(data, {
        })
            .then(doc => {
                resolve({
                    data: doc
                })
            })
            .catch((err) => { log.error(err); reject(err); });
    })
    .catch((err) => { log.error(err); reject(err); });


    // db.threat.bulkCreate(data)
    //     .then(doc => {
    //         resolve({
    //             data: doc
    //         })
    //     })
    //     .catch((err) => { log.error(err); reject(err); });
});


exports.getThreats = (req) => new Promise((resolve, reject) => {
    Threat.findAll({}).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.getThreatById = (id) => new Promise((resolve, reject) => {

    Threat.findAll({ where: { id: id } }).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.create = (data) => new Promise((resolve, reject) => {
    db.threat.create(data)
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
        db.threat.update(data, {
            where: { id: id }, individualHooks: true
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                resolve('Threat Successfully Updated.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });

exports.delete = (id) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));

        db.threat.destroy({
            where: { id: id },
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                log.info(`Threat deleted having id:${id}`);
                resolve('Threat Successfully Deleted.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });