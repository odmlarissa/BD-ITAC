module.exports = function(app){
  var controller = {};
  var crisisBusiness = app.business.crisis;

  /**
  * Registra uma nova crise
  * @author Danilo Ramalho
  * @param req HTTP request
  * @param res HHTP response
  */
  controller.saveCrisis = function(req, res, next){

    if(!req.body.hasOwnProperty('name') ||
    		!req.body.hasOwnProperty('email') ||
        !req.body.hasOwnProperty('phone') ||
        !req.body.hasOwnProperty('place') ||
        !req.body.hasOwnProperty('type') ||
        !req.body.hasOwnProperty('title')) {
          res.status(404).json('Required fields not informed.');
      }else{
        crisis = {
          name : req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          place: req.body.place,
          type: req.body.type,
          title: req.body.title,
          note: req.body.note
        };
console.log('controller');
        crisisBusiness.save(crisis, function(err, data) {
          if(err) {
              res.status(500).json(err);
          }else{
              res.json(data);
          }
        });
      }
 };

  return controller;

};
