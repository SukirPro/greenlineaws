const express = require('express');
const router = express.Router();

router.use('/v1.0', require('./v1.0/'));/**
 * @swagger
 * /user
 *  get: 
 *      descrption:test
 * 
 */
router.use('/user', require('./v1.0/'));
module.exports = router;