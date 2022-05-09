const express = require('express');
const router = express.Router();
const aircraftController = require('../../../controllers/aircraft.controller');

const { validateBody, validateToken } = require('../../../util/validator.util')
// const { importAircrafts,createValidation,updateValidation } = require('../../../validators/aircraft.validator')

router.post("/import",  aircraftController.import);

router.route('/')
    .get(aircraftController.getAll)
    .post( aircraftController.create);

router.route('/:id')
    .get(aircraftController.getAircraftById)
    .delete(aircraftController.delete)
    .patch( aircraftController.update);

module.exports = router;
