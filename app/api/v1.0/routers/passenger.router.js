const express = require('express');
const router = express.Router();
const passengerController = require('../../../controllers/passenger.controller');

const { validateBody, validateToken } = require('../../../util/validator.util')

router.post("/import", passengerController.import);

router.route('/')
    .get(passengerController.getAll)
    .post(passengerController.create);

router.route('/:id')
    .get(passengerController.getPassengerById)
    .delete(passengerController.delete)
    .patch(passengerController.update);


module.exports = router;
