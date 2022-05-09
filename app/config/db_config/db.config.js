const env = require('../../../config/env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    port: env.port,
    dialect: env.dialect,
    operatorsAliases: Sequelize.Op,
    // dialectOptions: {
    //     "ssl": {
    //       "require":true,
    //       "rejectUnauthorized": false
    //     }
    //   },
    pool: {
        max: env.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    },
    // logging:false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../../models/user')(sequelize, Sequelize);
db.aircraft = require('../../models/aircraft')(sequelize, Sequelize);
db.airline = require('../../models/airline')(sequelize, Sequelize);
db.airport = require('../../models/airport')(sequelize, Sequelize);
db.flight = require('../../models/flight')(sequelize, Sequelize);
db.passenger = require('../../models/passenger')(sequelize, Sequelize);
db.threat = require('../../models/threat')(sequelize, Sequelize);


require('./airline.db.config')(db);
require('./aircraft.db.config')(db);
require('./airport.db.config')(db);
require('./flight.db.config')(db);
require('./passenger.db.config')(db);

module.exports.createDB = (db) => {
    this.db.sequelize.sync({ force: false }).then(() => {
        console.log('Drop and Resync with { force: false }');
    });
}

module.exports = db;