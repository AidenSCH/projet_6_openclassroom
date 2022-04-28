// création des routes pour les sauces
const express = require('express');

const router = express.Router();
const saucesControl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");

router.post('/', auth, multer, saucesControl.createThing);
router.delete('/:id', auth,  saucesControl.deleteThing);
router.put('/:id' , auth, multer, saucesControl.modifyThing);   
router.get('/:id' , auth, saucesControl.getOne); 
router.get('/', auth, saucesControl.getAllStuff);
router.post("/:id/like" , auth, saucesControl.likeDislikeSauce)

 

    module.exports = router