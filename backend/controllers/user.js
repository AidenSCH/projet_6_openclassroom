const user = require('../models/user');
const bcrypt = require('bcrypt');

const jwt =require('jsonwebtoken');
require('dotenv').config();


exports.signup = (req, res, next) => {
    
bcrypt.hash(req.body.password, 10)
.then(hash =>{
    const user = new user({
        email: req.body.email,
        password: hash
    });
user.save()
.then(() =>res.status(201).json({message :'utilisateur créé !'}))
.catch(error => res.status(400).json({error}));       
})
.catch(error => res.status(500).json({error}));
}

exports.login = (req, res, next) => {
    user.findOne({email: req.body.email})
    .then(user =>{
        if (!user){
            return res.status(404).json({message :'utilisateur non trouvé !'});
        }
      bcrypt.compare(req.body.password, user.password)
      .then(valid=>{
          if (!valid){
            return res.status(404).json({message :'mot de passe incorrect !'});  
          }
          res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  {userId: user._id},
                  process.env.SECRET_TOKEN,
                  {expiresIn: '24h'}    
              )
          });
      })
      .catch(error =>res.status(500).json({message: 'erreur serveur !'}));  
        
    })
    .catch(error =>res.status(500).json({message: 'erreur serveur !'}));


};