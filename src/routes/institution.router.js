const express = require('express');
const InstitutionController = require('../controllers/InstitutionController');
const { authorize } = require('../middlewares/auth.middleware');
const multerConfig = require('../config/multer');
const multer = require('multer');

const router = express.Router();

router.post('/', InstitutionController.signup);
router.get('/', authorize, InstitutionController.getInstitution);
router.get('/:id', authorize, InstitutionController.getInstitutionById);
router.put('/:id', InstitutionController.updateInstitution);
router.post(
  '/image/:id',
  authorize,
  multer(multerConfig).single('file'),
  InstitutionController.updateImage
);
router.post(
  '/logo/:id',
  authorize,
  multer(multerConfig).single('file'),
  InstitutionController.updateLogo
);

module.exports = router;
