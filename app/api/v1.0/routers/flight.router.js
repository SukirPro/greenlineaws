const express = require('express');
const router = express.Router();
const flightController = require('../../../controllers/flight.controller');

const { validateBody, validateToken } = require('../../../util/validator.util')

router.post("/import", flightController.import);

router.route('/')
    .get(flightController.getAll)
    .post( flightController.create);

router.route('/:id')
    .get(flightController.getFlightById)
    .delete(flightController.delete)
    .patch( flightController.update);

router.get('/:id/threats', flightController.getFlightThreats)


module.exports = router;
