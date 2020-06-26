var express = require('express');
var router = express.Router();
var game = require('./game.js');


/*

{
    "idsala":"5eb18d18f1162243fc58add25aa396681534b11f",
    "valor":"O",
    "posicion":8
}

*/

router.put('/', function(req, res) {
    var idsala = req.body.idsala;
    var valor = req.body.valor;
    var posicion = req.body.posicion;
    game.JugadaPrincipal(idsala,valor,posicion,function(error,sala){
      res.json(sala);
    });
  });

  /*
  http://localhost:3000/turn/room/?idsala=<idsala>
  Respuesta, una sala entera.
  */
router.get('/room', function(req, res) {
  var idsala = req.query.idsala.toString();
    game.GetRoom(idsala,function(err, result){
      if(err!=null){
        throw err;
      }
      console.log(result[0]);
      res.json(JSON.parse(result[0]));
    });
  });

router.post('/room/create',function (req,res){
  var nombre = req.body.nombre;
  res.json(game.CreateRoom(nombre));
});

module.exports = router;