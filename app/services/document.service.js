const db = require("../config/db_config/db.config");
const Documents = db.document;

const path = require('path');
const fs = require("fs");
const imagePath =  "app/storage/documents";
const getImagePath = 'documents'

const log4js = require("../../config/log4js");
const log = log4js.getLogger("document.service.js");

/**
 *
 * @param documentableType
 * @param documentableId
 * @returns {Promise<unknown>}
 */
exports.getDocuments = (documentableType, documentableId) =>
  new Promise(async (resolve, reject) => {
    try {
      Documents.findAll({
        order: [["id", "DESC"]],
        where: {
          documentable_id: documentableId,
          documentable_type: documentableType,
        },
      })
        .then((documents) => {
          documents.forEach((d) => {
            d["dataValues"]["path"] = `http://${process.env.APP_ADDRESS}:${process.env.APP_PORT}/${getImagePath }/${d.id}${d.extension}`
          });
          resolve(documents);
        })
        .catch((err) => {
          log.error(err);
          reject(err);
        });
    } catch (err) {
      log.error(err);
      reject(err);
    }
  });

/**
 *
 * @param documentableType
 * @param documentableId
 * @param files
 * @param headers
 * @returns {Promise<unknown>}
 */
exports.uploadDocument = (documentableType, documentableId, files, headers) => new Promise(async (resolve, reject) => {
    try {
      let values = []
      if(!files.image.length) values.push(files.image)
      else values = files.image

        for (let index = 0; index < values.length; index++) {
          const file = values[index];
          await Documents.create({
            name: path.basename(file.name),
            mime: file.mimetype,
            extension: path.extname(file.name),
            size: file.size,
            documentable_id: documentableId,
            documentable_type: documentableType,
            user_id: getToken(headers).key,
          })
            .then(async (document) => {
              let filePath = path.join(`${imagePath}/${document.id}${document.extension}`);
              if ((await fs.existsSync(imagePath)) === false) {
                  await fs.mkdirSync(imagePath, { recursive: true }, (err) => {
                  if (err) throw err;x
                });
              }
              await file.mv(filePath);
            })
            .catch((err) => {
              log.error(err);
              reject(err);
            });
        }
      resolve("document Successfully Created.");
    } catch (err) {
      log.error(err);
      reject(err);
    }
  });

/**
 *
 * @param id
 * @returns {Promise<unknown>}
 */
exports.deleteDocument = (id) =>
  new Promise((resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`));
    Documents.findOne({
      where: { id: id },
    })
      .then((document) => {
        if (document) {
          document.destroy().then(() => {
            let filePath = path.join(`${imagePath}/${document.id}${document.extension}`);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
          log.info(`Product deleted having id:${id}`)
          resolve("Product Successfully Deleted.");
        } else reject(new Error("Can not deleted"));
      })
      .catch((err) => {
        log.error(err);
        reject(err);
      });
  });

/**
 *
 * @param id
 * @returns {Promise<unknown>}
 */
exports.downloadDocument = (id) =>
  new Promise(async (resolve, reject) => {
    if (!id) reject(new Error(`id can't be empty`));
    Documents.findOne({ where: { id: id } })
      .then((document) => {
        document["dataValues"]["path"] = `http://${process.env.APP_ADDRESS}:${process.env.APP_PORT}/${getImagePath }/${document.id}${document.extension}`
        resolve(document);
      })
      .catch((err) => {
        log.error(err);
        reject(err);
      });
  });
