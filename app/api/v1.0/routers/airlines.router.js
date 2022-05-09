const express = require('express');
const router = express.Router();
const airlineController = require('../../../controllers/airline.controller');

const { validateBody, validateToken } = require('../../../util/validator.util')

router.post("/import",  airlineController.import);

router.route('/')
    .get(airlineController.getAll)
    .post( airlineController.create);

router.route('/:id')
    .get(airlineController.getAirlineById)
    .delete(airlineController.delete)
    .patch(airlineController.update);


module.exports = router;
