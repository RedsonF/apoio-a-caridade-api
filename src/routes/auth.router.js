const express = require('express');
const authController = require('../controllers/AuthController');
const { authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.put('/logout', authorize, authController.logout);

module.exports = router;
