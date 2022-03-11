const express = require('express');
const donorController = require('../controllers/DonorController');
const { authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', donorController.signup);
router.get('/:id', authorize, donorController.getDonorById);
router.put('/:id', donorController.update);

module.exports = router;
