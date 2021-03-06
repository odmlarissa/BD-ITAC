var db = require("../db/transacao");


var crisisDAO = null;

// Inicialização do objeto, obrigando passagem de POOL como parametro.
// Retorna um objeto crisisDAO implementado logo em seguida.
module.exports = function(app) {
    return crisisDAO(app.db.conexao);
};


crisisDAO = function(pool) {
    var self = this;
    if (pool !== null) {
        this.pool = pool;
    }

  var dao = {};

  /**
  * Realiza registro de uma nova crise
  * @author Edizon
  * @param objeto crisis
  */
  dao.save = function(crisis, callback)
  {
    getDados(crisis, function(dados)
    {
        if(dados === "")
        {
          return(callback('Impossible to retrieve all data', null));
        }
        //Modificado por Edizon: utilizando transações por conta dos campos
        // auto incrementado.
        var query = "insert into crise set \n\
           crt_id = ?, \n\
           cri_descricao= ?, \n\
           cri_inicio = NOW(), \n\
           cri_ativa=?, \n\
           cri_regiao=?, \n\
           cid_id=?, \n\
           cri_geotipo=?; \n\
            \n\n\
           select @idCrise:=cri_id from crise where cri_id = LAST_INSERT_ID();\n\n";


           for(var c in dados.avs_ids)
           {
             query += "insert into aviso_crise set \n \
                       cri_cod = @idCrise, \n \
                       avs_cod = '"+ dados.avs_ids[c] +"';\n\n";

             query += "update aviso set \n \
                        sta_cod = 2 \n \
                        where avs_id = "+ dados.avs_ids[c] + ";\n\n"
           };
     db.executarTransacao(
        self.pool,

        function(conn)
        {
            conn.query(query, [dados.crt_id,
                               dados.cri_descricao,
                               dados.cri_ativa,
                               dados.cri_regiao,
                               dados.cid_id,
                               dados.cri_geotipo]
              ,function (err, result) {
                if(err)
                {
                  callback(err, {});
                  console.log(err);
                }
                else
                {
                  var message = {
                      "message" : {
                        "id" : result.insertId,
                        "type" : "INFO",
                        "status" : "OK",
                        "description" : "Crise registrada",
                        "info" : "BD-ITAC"
                      }
                    };
                  return callback(null, message);
                  }
              }
            );
        });
    });
  };

 function getCidade(cidade, callback)
 {
   self.pool.query(
      "select cid_id from cidade where cid_nome = ?", cidade,
      function(err, rows){
        if(!err && rows.length>0){
         callback(rows[0].cid_id);
        }
        else {
          callback(0);
        }
      });
 };

 function getDados(crisis, callback){
   getCidade(crisis.cidade,
     function(cidade_id)
     {
        if(!cidade_id && cidade_id == 0)
        {
          callback("");
        }

        var dados={
                  crt_id: crisis.tipo,
                  cri_descricao: crisis.descricao,
                  cri_inicio: new Date(),
                  cri_ativa: 1,
                  cri_regiao: crisis.regiao_coords,
                  cid_id: cidade_id,
                  cri_geotipo: crisis.geoid,
                  avs_ids: crisis.avisosId
                };
        callback(dados);
      });

    };

  dao.listCrisis = function(callback){
    /*var query =
    "select cri.cri_id  as cri_id,             \
             usu.usu_nm as cri_nome,       \
            usu.usu_fone as cri_telefone,  \
            usu.usu_email as cri_email,    \
            cri.cri_ds as cri_descricao,   \
            event.eve_ds as cri_categoria, \
            geo.geo_lat as cri_latitude,   \
            geo.geo_long as cri_longitude, \
            cri.cri_ini as cri_dh_inicio,  \
            cri.cri_fim as cri_dh_fim,      \
            cri.cri_atv as cri_ativo,      \
            cri.cri_pic1,                  \
            cri.cri_pic2,                  \
            cri.cri_pic3                   \
       from  crise cri                     \
        join ocorrencia ocor on ocor.oco_cri_cod = cri.cri_id  \
        join usuario usu on usu.usu_id = oco_usu_cod           \
        join geografica geo on geo.geo_id = oco_geo_cod        \
        join evento event on event.eve_id = ocor.oco_eve_cod";
    */
    /*jshint multistr: true */
    var query = "select cri.cri_id, cri.cri_descricao, date_format(cri.cri_inicio,'%d/%m/%Y') AS cri_inicio, date_format(cri.cri_final,'%d/%m/%Y') AS cri_final, CAST(cri.cri_ativa AS DECIMAL(1)) AS cri_ativa, cri.cri_regiao, cri.cri_geotipo, tip.crt_descricao, cri.cid_id, cid_nome, cid.est_sigla, \
                        (SELECT count(*) FROM aviso_crise avs WHERE avs.cri_cod=cri.cri_id) AS count_aviso, \
                        (SELECT count(*) FROM alerta ale WHERE ale.cri_cod=cri.cri_id) AS count_alerta \
                 from  crise cri \
                 inner join crise_tipo tip on tip.crt_id=cri.crt_id \
                 inner join cidade cid on cid.cid_id=cri.cid_id";
    self.pool.query(
       query,
       function(err, rows){
      if(err){
        callback(err,{});
      }else{
        //callback(null, getCrises(rows));
        callback(null, rows);
      }
    });
  };

  function getCrises(rows){
    var crises = [];
    for(c in rows){

      var pic1 = '';
      var pic2 = '';
      var pic3 = '';

      if(rows[c].cri_pic1 != null) pic1 = new Buffer(rows[c].cri_pic1).toString('base64');
      if(rows[c].cri_pic2 != null) pic2 = new Buffer(rows[c].cri_pic2).toString('base64');
      if(rows[c].cri_pic3 != null) pic3 = new Buffer(rows[c].cri_pic3).toString('base64');

      var crise={
                id: rows[c].cri_id,
                nome: rows[c].cri_nome,
                telefone: rows[c].cri_telefone,
                email: rows[c].cri_email,
                descricao: rows[c].cri_descricao,
                categoria: rows[c].cri_categoria,
                latitude: rows[c].cri_latitude,
                longitude: rows[c].cri_longitude,
                dataInicial: rows[c].cri_dh_inicio,
                dataFinal: rows[c].cri_dh_fim,
                ativo: rows[c].cri_ativo,
                pic1:   pic1,
                pic2:   pic2,
                pic3:   pic3
              };
              crises.push(crise);

    }

    return crises;
  }

  dao.getCrisisID = function(cri_id, callback){
    self.pool.query('SELECT * FROM crise WHERE cri_id = ?', cri_id, function(err, rows){
      if(err){
        return callback(err, null);
      }else{
        return callback(null, rows);
      }
    });
  };

  dao.getDetailCrisis = function(cri_id, callback){
    var query = "select cri.cri_id, cri.cri_descricao, date_format(cri.cri_inicio,'%d/%m/%Y') AS cri_inicio, date_format(cri.cri_final,'%d/%m/%Y') AS cri_final, CAST(cri.cri_ativa AS DECIMAL(1)) AS cri_ativa, cri.cri_regiao, cri.cri_geotipo, tip.crt_descricao, cri.cid_id, cid_nome, cid.est_sigla, \
                        (SELECT count(*) FROM aviso_crise avs WHERE avs.cri_cod=cri.cri_id) AS count_aviso, \
                        (SELECT count(*) FROM alerta ale WHERE ale.cri_cod=cri.cri_id) AS count_alerta \
                 from  crise cri \
                 inner join crise_tipo tip on tip.crt_id=cri.crt_id \
                 inner join cidade cid on cid.cid_id=cri.cid_id \
                 where cri.cri_id = ?";

    self.pool.query(query, cri_id, function(err, crises){
      if(err){
        return callback(err, null);
      }else{
        if(crises.length > 0){
          var query = "SELECT \
                         avi.avs_id, \
                         avi.sta_cod, \
                         (SELECT sta_ds FROM bditac.aviso_status WHERE sta_id = avi.sta_cod) AS sta_descricao, \
                         avi.geo_cod, \
                         avi.cat_cod, \
                         (SELECT cat_ds FROM bditac.categoria WHERE cat_id=avi.cat_cod) AS cat_descricao, \
                         avi.usu_cod, \
                         (SELECT usu_nm FROM bditac.usuario WHERE usu_id = avi.usu_cod) AS usu_nome, \
                         avi.avs_ds, \
                         avi.avs_latitude, \
                         avi.avs_longitude, \
                         date_format(avi.avs_data,'%d/%m/%Y') AS avs_data, \
                         avi.avs_ptcoord \
                      FROM bditac.aviso avi \
                      WHERE avi.avs_id in (SELECT avs_cod FROM bditac.aviso_crise WHERE cri_cod = ?)";

          self.pool.query(query, cri_id, function(err, avisos){
            if(err){
              return callback(err, null);
            }else{
              var crise = crises[0];
              crise.avisos = avisos;
              return callback(null, crise);
            }
          });
        }
      }
    });
  };

  dao.listType = function(callback){
    self.pool.query('SELECT * FROM crise_tipo', function(err, rows){
      if(err){
        return callback(err, null);
      }else{
        return callback(null, rows);
      }
    });
  };

  dao.listTypeClass = function(callback){
    self.pool.query('SELECT * FROM crise_tipo_classe', function(err, rows){
      if(err){
        return callback(err, null);
      }else{
        return callback(null, rows);
      }
    });
  };

  dao.listTypeGroup = function(ctc_id, callback){
    self.pool.query('SELECT * FROM crise_tipo_grupo WHERE ctc_id = ?',
    [ctc_id], function(err, rows){
      if(err){
        return callback(err, null);
      }else{
        return callback(null, rows);
      }
    });
  };

  dao.listTypeSubGroup = function(param, callback){
    self.pool.query('SELECT * FROM crise_tipo_subgrupo WHERE ctg_id = ? AND ctc_id = ?',
    [param.ctg_id, param.ctc_id], function(err, rows){
      if(err){
        return callback(err, null);
      }else{
        return callback(null, rows);
      }
    });
  };

  dao.listTypeType = function(param, callback){
    self.pool.query('SELECT * FROM crise_tipo_tipo WHERE cts_id= ? AND ctg_id = ? AND ctc_id', [param.cts_id, param.ctg_id, param.ctc_id], function(err, rows){
      if(err){
        return callback(err, null);
      }else{
        return callback(null, rows);
      }
    });
  };

  dao.listTypeSubType = function(param, callback){
    self.pool.query('SELECT * FROM crise_tipo_subtipo WHERE ctt_id= ? AND cts_id = ? AND ctg_id = ? AND ctc_id = ?',
    [param.ctt_id, param.cts_id, param.ctg_id, param.ctc_id], function(err, rows){
      if(err){
        return callback(err, null);
      }else{
        return callback(null, rows);
      }
    });
  };

  dao.saveType = function(param, callback){
    self.pool.query('INSERT INTO crise_tipo (ctc_id, ctg_id, cts_id, ctt_id, ctp_id, crt_descricao, crt_definicao, crt_cobrade) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [param.ctc_id, param.ctg_id, param.cts_id, param.ctt_id, param.ctp_id,
      param.crt_descricao, param.crt_definicao, param.crt_cobrade], function(err, rows){
        if(err){
          return callback(err, null);
        }else{
          return callback(null, rows);
        }
      });
  };
  dao.cancelCrisis = function(cri_id, callback){
    self.pool.query('UPDATE crise SET cri_ativa = 0 WHERE cri_id = ?', [cri_id], function(err, rows){
        if(err){
          return callback(err, null);
        }else{
          return callback(null, {'crises': true});
        }
      });
  };
  dao.acceptedCrisis = function(cri_id, callback){
    console.log('aqui');
    self.pool.query('INSERT INTO alerta (cri_cod, alt_timestamp, geo_cod, alt_raio) VALUES (?, NOW(), 1, 1)', [cri_id], function(err, rows){
        if(err){
          return callback(err, null);
        }else{
          return callback(null, rows);
        }
      });
  };

  return dao;
};
