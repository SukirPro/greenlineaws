// const Sequelize = require('Sequelize')
const moment = require('moment')
const db = require("../config/db_config/db.config");

exports.today = { date: { [db.Sequelize.Op.between]: [ moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') ,  moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')] } }
exports.last7Days = { date: { [db.Sequelize.Op.between]: [ moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss') , moment().subtract(0, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')] } }
exports.thisManth = { date: { [db.Sequelize.Op.between]: [ moment().startOf('month').format('YYYY-MM-DD HH:mm:ss') ,moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')] } }
exports.thisYear = { date: { [db.Sequelize.Op.between]: [ moment().startOf('year').format('YYYY-MM-DD HH:mm:ss') ,moment().endOf('year').format('YYYY-MM-DD HH:mm:ss')] } }