const express = require('express');
const PublicationController = require('../controllers/PublicationController');
const { authorize } = require('../middlewares/auth.middleware');
const multerConfig = require('../config/multer');
const multer = require('multer');

const router = express.Router();

router.post(
  '/',
  authorize,
  multer(multerConfig).array('file'),
  PublicationController.add
);
router.get('/', authorize, PublicationController.getPublication);
router.get('/:id', authorize, PublicationController.getPublicationById);
router.put('/:id', authorize, PublicationController.updatePublication);
router.put('/like/:id', authorize, PublicationController.likePublication);
router.delete('/:id', authorize, PublicationController.deletePublication);

module.exports = router;
