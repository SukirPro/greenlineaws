const db = require("../config/db_config/db.config");
const historydetails = db.history;
const Op = db.Sequelize.Op;

const log4js = require("../../config/log4js");
const log = log4js.getLogger("history.service.js");
const moment = require("moment");

/**
 * @returns {Object}
 */
exports.getHistoryDetails = (customerId, page, itemPerPage, start, end) =>
  new Promise((resolve, reject) => {
    if (!customerId) reject(new Error(`id can't be empty`));
    var startDate = start
      ? moment(start).format("YYYY-MM-DDTHH:mm:ssZZ")
      : null;
    var EndDate = end ? moment(end).format("YYYY-MM-DDTHH:mm:ssZZ") : null;
    var DateRangeFilter;
    const { limit, offset } = getPagination(page, itemPerPage);
    if (startDate != null && EndDate != null) {
      DateRangeFilter = { date: { [Op.between]: [startDate, EndDate] } };
    } else {
      DateRangeFilter = null;
    }

    var condition = {
      [Op.and]: [{ customer_id: customerId }, DateRangeFilter],
    };
    historydetails
      .findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]],
        where: condition,
      })
      .then(resolve)
      .catch((err) => {
        log.error(err);
        reject(err);
      });
  });

/**
 *
 * @param {Object} data
 * @returns {Object}
 */
exports.create = (customerId, data) =>
  new Promise((resolve, reject) => {
    new historydetails({
      ...data,
      customer_id: customerId,
    })
      .save()
      .then(resolve)
      .catch((err) => {
        log.error(err);
        reject(err);
      });
  });

/**
 *
 * @param {int} id
 * @param {Object} data
 * @returns{Object}
 */
exports.update = (id, data) =>
  new Promise((resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`));
    historydetails
      .update(data, {
        where: { id: id },
      })
      .then((data) => {
        if (!data) throw new Error("Invalid Id.");
        resolve("History detail Successfully Updated.");
      })
      .catch((err) => {
        log.error(err);
        reject(err);
      });
  });
