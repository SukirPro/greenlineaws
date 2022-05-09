const express = require('express');
const router = express.Router();
const airportController = require('../../../controllers/airport.controller');

const { validateBody, validateToken } = require('../../../util/validator.util')

router.post("/import",  airportController.import);

router.route('/')
    .get(airportController.getAll)
    .post(airportController.create);

router.route('/:id')
    .get(airportController.getAirportById)
    .delete(airportController.delete)
    .patch( airportController.update);

router.get('/:id/threats', airportController.getAirportThreats)


module.exports = router;
