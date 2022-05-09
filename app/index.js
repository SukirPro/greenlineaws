const express = require('express');
const app = express();

app.use('/api', require('../app/api'));
module.exports.app = app;