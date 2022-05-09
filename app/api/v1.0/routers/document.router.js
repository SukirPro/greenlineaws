const { Router } = require('express');
const router = Router();
const documentController = require('../../../controllers/document.controller');

const { validateToken } =require('../../../util/validator.util')

router.get('/:id/download', validateToken(), documentController.download)
router.get('/:model/:modelId', validateToken(), documentController.getAll)
router.post('/upload/:model/:modelId', validateToken(), documentController.upload)
router.delete('/:id', validateToken(),  documentController.delete)

module.exports = router;