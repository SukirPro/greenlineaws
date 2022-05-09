const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.use('/users', require('./routers/user.router'));
router.use('/airlines', require('./routers/airlines.router'));
router.use('/aircrafts', require('./routers/aircraft.router'));
router.use('/airports', require('./routers/airport.router'));
router.use('/flights', require('./routers/flight.router'));
router.use('/passengers', require('./routers/passenger.router'));
router.use('/threats', require('./routers/threat.router'));
router.use('/auth', require('./routers/auth.router'));

module.exports = router;