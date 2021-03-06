var halson = require('halson');
module.exports = function(app){
  var controller = {};
  var crisisBusiness = app.business.crisis;
  var crisisDAO = app.dao.crisis;

  /**
  * Registra uma nova crise
  * @author Danilo Ramalho
  * @param req HTTP request
  * @param res HHTP response
  */
  controller.saveCrisis = function(req, res, next){
     crisisBusiness.save(req.body, function(err, data) {
          if(err) {
            var status = err.validationError ? 400 : 500;
            res.status(status).json(err);
          }else{
              res.status(201).json(data);
          }
        });

 };


  /***
   * Retorno das crisis
   */
   controller.listCrisis = function(req,res,next)
   {
	   crisisDAO.listCrisis(function(err, data) {
		   if(err)
		   {
			   res.status(500).json(err);
		   }
		   else
		   {
			   if(data !== null && data.length >= 0){
				   res.json(data);
			   }
			   else
			   {
				   res.status(404).json({message:'Something went wrong. Please Try again later.'});
			   }
		   }
	   });
   };

   controller.getCrisisID = function(req, res, next){
     crisisDAO.getCrisisID(req.params.cri_id, function(err, data){
       if(err){
         res.status(500).json(err);
       }else{
         res.json(data);
       }
     });
   };

   controller.getDetailCrisis = function(req, res, next){
     crisisDAO.getDetailCrisis(req.params.cri_id, function(err, data){
       if(err){
         res.status(500).json(err);
       }else{
         res.json(data);
       }
     });
   };


 controller.listType = function(req, res, next){
   crisisDAO.listType(function(err, data){
     if(err){
       res.status(500).json(err);
     }else{
       res.json(data);
     }
   });
 };

 controller.listTypeClass = function(req, res, next){
   crisisDAO.listTypeClass(function(err, data){
     if(err){
       res.status(500).json(err);
     }else{
       res.json(data);
     }
   });
 };

 controller.listTypeGroup = function(req, res, next){
   crisisDAO.listTypeGroup(req.params.ctc_id, function(err, data){
     if(err){
       res.status(500).json(err);
     }else{
       res.json(data);
     }
   });
 };

 controller.listTypeSubGroup = function(req, res, next){
   var param = {
     ctc_id: req.params.ctc_id,
     ctg_id: req.params.ctg_id
   };
   crisisDAO.listTypeSubGroup(param, function(err, data){
     if(err){
       res.status(500).json(err);
     }else{
       res.json(data);
     }
   });
 };

 controller.listTypeType = function(req, res, next){
   var param = {
     ctc_id: req.params.ctc_id,
     ctg_id: req.params.ctg_id,
     cts_id: req.params.cts_id
   };
   crisisDAO.listTypeType(param, function(err, data){
     if(err){
       res.status(500).json(err);
     }else{
       res.json(data);
     }
   });
 };

 controller.listTypeSubType = function(req, res, next){
   var param = {
     ctc_id: req.params.ctc_id,
     ctg_id: req.params.ctg_id,
     cts_id: req.params.cts_id,
     ctt_id: req.params.ctt_id
   };
   crisisDAO.listTypeSubType(param, function(err, data){
     if(err){
       res.status(500).json(err);
     }else{
       res.json(data);
     }
   });
 };

controller.saveType = function(req, res, next){
  if(!req.body.hasOwnProperty('ctc_id') ||
     !req.body.hasOwnProperty('ctg_id') ||
     !req.body.hasOwnProperty('cts_id') ||
     !req.body.hasOwnProperty('ctt_id') ||
     !req.body.hasOwnProperty('ctp_id') ||
     !req.body.hasOwnProperty('crt_descricao') ||
     !req.body.hasOwnProperty('crt_definicao') ||
     !req.body.hasOwnProperty('crt_cobrade')) {
        res.status(404).json({success: false, message: 'Required fields not informed.'});
    }else{
      crisisDAO.saveType(req.body, function(err, data){
        if(err){
          res.status(500).json({success: false, message: err});
        }else{
          res.json({success: true, message: data});
        }
      });
    }
};

controller.cancelCrisis = function(req, res, next){
  if(!req.params.hasOwnProperty('cri_id')){
    res.status(404).json({success: false, message: 'Required ID not informed.'});
  }else{
    crisisBusiness.cancelCrisis(req.params.cri_id, function(err, data){
      if(err){
        res.status(500).json({success: false, message: err});
      }else{
        res.json({success: true, message: data});
      }
    });
  }
};

controller.acceptedCrisis = function(req, res, next){
  if(!req.body.hasOwnProperty('cri_id')){
    res.status(404).json({success: false, message: 'Required ID not informed.'});
  }else{
    crisisDAO.acceptedCrisis(req.body.cri_id, function(err, data){
      if(err){
        res.status(500).json({success: false, message: err});
      }else{
        res.json({success: true, message: data});
      }
    });
  }
};


  return controller;

};
