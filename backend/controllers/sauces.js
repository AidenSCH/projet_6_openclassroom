const Sauces = require('../models/sauces');

const fs = require('fs');


exports.createThing = (req, res, next) => {
    const saucesObject = JSON.parse(req,body.sauces);
    delete saucesObject._id;
    const sauces = new Sauces({
      ...saucesObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked:[''],
      usersDisliked:[''],

      
    });
    sauces
    .save()
    .then(()=> res.status(201).json({message: 'sauce bien enregistrée!'}))
    .catch(error => res.status(400).json({error}));
  };

  exports.deleteThing = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then(sauces => {
        const filename = sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

   
  
   

  exports.modifyThing = (req, res, next) => {
    const saucesObject = req.file ?
      {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };

    Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };


  exports.getOne = (req, res, next) =>{
    Sauces.findOne({_id: req.params.id})
    .then(sauces =>res.status(200).json(sauces))
    .catch(error =>res.status(404).json({error}));
    
    };

    exports.getAllStuff = (req, res, next) => {
        Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error})); 
      };


      exports.likeDislikeSauce = (req, res, next) => {
        let like = req.body.like
        let userId = req.body.userId
        let sauceId = req.params.id
        
        switch (like) {
          case 1 :
              Sauces.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
                .then(() => res.status(200).json({ message: `J'aime` }))
                .catch((error) => res.status(400).json({ error }))
                  
            break;
      
          case 0 :
              Sauces.findOne({ _id: sauceId })
                 .then((sauce) => {
                  if (sauce.usersLiked.includes(userId)) { 
                    Sauces.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                      .then(() => res.status(200).json({ message: `Neutre` }))
                      .catch((error) => res.status(400).json({ error }))
                  }
                  if (sauce.usersDisliked.includes(userId)) { 
                    Sauces.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                      .then(() => res.status(200).json({ message: `Neutre` }))
                      .catch((error) => res.status(400).json({ error }))
                  }
                })
                .catch((error) => res.status(404).json({ error }))
            break;
      
          case -1 :
              Sauces.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
                .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
                .catch((error) => res.status(400).json({ error }))
            break;
            
            default:
              console.log(error);
        }
      }