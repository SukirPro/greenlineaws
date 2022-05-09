const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/user.controller');

const { validateBodyWithToken, validateToken } = require('../../../util/validator.util')
const { createRequest, updateRequest, uniqueValidation } = require('../../../validators/user.request')

router.get('/:id/soft-delete', validateToken(), userController.softDelete);
router.get('/search', validateToken(), userController.search);

router.post('/:id/image-upload', validateToken(), userController.imageUpload);
router.post("/reset-password", userController.resetPassword);
router.post("/change-password", validateToken(), userController.changeTempPassword);

router.post("/:id/reset-password", userController.userpasswordReset);

router.route('/')
    .get(validateToken(), userController.getAll)
    .post(validateBodyWithToken(createRequest), userController.create);
router.route('/external-user')
    .post(userController.createExternalUser);
router.route('/:id')
    .get(validateToken(), userController.show)
    .delete(validateToken(), userController.delete)
    .patch(validateBodyWithToken(updateRequest), userController.edit);

module.exports = router;
