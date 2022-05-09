const express = require('express');
const router = express.Router();
const threatController = require('../../../controllers/threat.controller');

const { validateBody, validateToken } = require('../../../util/validator.util')

router.post("/import",  threatController.import);

router.route('/')
    .get(threatController.getAll)
    .post( threatController.create);

router.route('/:id')
    .get(threatController.getThreatById)
    .delete(threatController.delete)
    .patch( threatController.update);


module.exports = router;
