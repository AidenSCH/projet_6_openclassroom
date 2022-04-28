// création des routes pour l'utilisateur
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/auth/signup', userController.signup);
router.post('/auth/login', userController.login);


module.exports = router;

