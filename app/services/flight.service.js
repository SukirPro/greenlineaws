const db = require('../config/db_config/db.config');
const Flight = db.flight;
const log4js = require('../../config/log4js')
const log = log4js.getLogger("flight.service.js");


exports.import = (data) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();

    await db.flight.destroy({ where: {} })

    db.flight.destroy({ truncate: { cascade: false } })
        .then(doc1 => {
            transaction.commit();
            db.flight.bulkCreate(data, {
            })
                .then(doc => {
                    resolve({
                        data: doc
                    })
                })
                .catch((err) => { log.error(err); reject(err); });
        })
        .catch((err) => { log.error(err); reject(err); });

 
});


exports.getFlights = (req) => new Promise((resolve, reject) => {
    Flight.findAll({}).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.getFlightById = (id) => new Promise((resolve, reject) => {

    Flight.findAll({ where: { id: id } }).then(resolve)
        .catch(err => {
            log.error(err)
            reject(err)
        })
})


exports.create = (data) => new Promise((resolve, reject) => {
    db.flight.create(data)
        .then(doc => {
            doc.addDeparture({ 'departure': data.depature, 'flight_number': doc.id }).then(async () => {
                resolve({
                    data: doc
                })
            })
            doc.addArrival({ 'arrival': data.depature, 'flight_number': doc.id }).then(async () => {
                resolve({
                    data: doc
                })
            })
        })
        .catch((err) => { log.error(err); reject(err); });
});


exports.update = (id, data) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));
        db.flight.update(data, {
            where: { id: id }, individualHooks: true
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                resolve('Flight Successfully Updated.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });

exports.delete = (id) =>
    new Promise((resolve, reject) => {
        if (!id) reject(new Error(`id can't be empty`));

        db.flight.destroy({
            where: { id: id },
        })
            .then((data) => {
                if (!data) throw new Error('Invalid Id.');
                log.info(`Flight deleted having id:${id}`);
                resolve('Flight Successfully Deleted.');
            })
            .catch((err) => {
                log.error(err);
                reject(err);
            });
    });


exports.getFlightThreats = (id) => new Promise((resolve, reject) => {

    Flight.findOne({
        include: [
            {
                model: db.passenger,
                as: 'passenger',
                // where: { flight_number: flight_number },
            }
        ], where: { id: id }
    }).then((dbFlight) => {
        console.log('------------------------------------------------------')
        console.log(dbFlight.toJSON())
        var flightTheat = dbFlight.toJSON()
        console.log('------------------------------------------------------')
        console.log(flightTheat.flight_number)
        db.passenger.findAll({
            include: [
                {
                    model: db.threat,
                    as: 'threat',

                }
            ], where: { flight_number: flightTheat.flight_number }
        }).then((dbPassenger) => {
            console.log(dbPassenger)

            flightTheat['passenger'] = dbPassenger.toJSON()
            resolve({
                data: flightTheat
            })

        })
    })
        .catch(err => {
            log.error(err)
            reject(err)
        })
})