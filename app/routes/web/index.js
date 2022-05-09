const express = require('express');
const router = express.Router();

/** home route */
router.use('/', require('./routers/home.router.js'));

module.exports = router;