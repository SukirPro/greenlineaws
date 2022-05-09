const { Router } = require('express');
const router = Router();
const countryController = require('../../../controllers/country.controller');

const { validateToken } =require('../../../util/validator.util')

router.get('/', validateToken(), countryController.getAll)
    
router.get('/search', validateToken(), countryController.search)


module.exports = router;
