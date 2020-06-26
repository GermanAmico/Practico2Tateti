

const redis = require("redis");
const client = redis.createClient();
const crypto = require('crypto');
const async = require('async');

client.on("error", function(error) {
  console.error(error);
});



function IngresarValor(jugada,valor,posicion){
    if(jugada.tateti[posicion] != ""){
        return jugada;
    }
    if(valor=="X" || valor=="O"){
        jugada.tateti[posicion] = valor;
        return jugada;
    }else{
        return jugada;
    }
}

function verificarHorizontal(jugada){
    let i = 0;
    let valor = ['X','O'];
    let sum = 0;
    while(sum<2){
        if(jugada.tateti[0]==valor[sum] && jugada.tateti[1]==valor[sum] && jugada.tateti[2]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        if(jugada.tateti[3]==valor[sum] && jugada.tateti[4]==valor[sum] && jugada.tateti[5]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        if(jugada.tateti[6]==valor[sum] && jugada.tateti[7]==valor[sum] && jugada.tateti[8]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        sum = sum +1;
    }
    return jugada;
}

function verificarVertical(jugada){
    let i = 0;
    let valor = ['X','O'];
    let sum = 0;
    while(sum<2){
        if(jugada.tateti[0]==valor[sum] && jugada.tateti[3]==valor[sum] && jugada.tateti[6]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        if(jugada.tateti[1]==valor[sum] && jugada.tateti[4]==valor[sum] && jugada.tateti[7]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        if(jugada.tateti[2]==valor[sum] && jugada.tateti[5]==valor[sum] && jugada.tateti[8]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        sum = sum +1;
    }
    return jugada;
}

function verificarDiagonal(jugada){
    let i = 0;
    let valor = ['X','O'];
    let sum = 0;
    while(sum<2){
        if(jugada.tateti[0]==valor[sum] && jugada.tateti[4]==valor[sum] && jugada.tateti[8]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        if(jugada.tateti[2]==valor[sum] && jugada.tateti[4]==valor[sum] && jugada.tateti[6]==valor[sum]){
            if(sum==0){
                jugada.ganador = "Jugador1";
            }
            if(sum==1){
                jugada.ganador = "Jugador2";
            }
            break;
        }
        sum = sum +1;
    }
    return jugada; 
}

var JugadaPrincipal=function (idsala,valor,posicion,cb){

    async.waterfall([
        //Primera etapa, traemos la sala.
        function(callback){
            client.get(idsala, function(error,result){
                if(error){
                    throw error;
                }
                sala = JSON.parse(result);
                jugada = sala.jugada;
                console.log("TRAEMOS LA SALA\n" + sala);
                callback(null,jugada,sala,valor,posicion);
            });
        },
        //Segunda etapa, cargamos valores a nuestro tablero de tateti de la sala.
        function(jugada,sala,valor,posicion,callback){
            jugada = IngresarValor(jugada,valor,posicion);
            callback(null,jugada,sala);
        },
        //Tercera etapa, buscamos ganadores.
        function(jugada,sala,callback){
            if(jugada.jugadas<9){
                jugada = verificarHorizontal(jugada);
                if(jugada.ganador !=""){
                    sala.jugada = jugada;
                    callback(null,sala);  
                }else{
                    jugada = verificarVertical(jugada);
                    if(jugada.ganador !=""){
                       sala.jugada = jugada;
                       callback(null,sala);
                    }else{
                        jugada = verificarDiagonal(jugada);  
                        if(jugada.ganador !=""){
                            sala.jugada = jugada;
                            callback(null,sala);
                        }else{
                            if(jugada.jugadas==9){
                                jugada.ganador = "Empate";
                                sala.jugada = jugada;
                                callback(null,sala);
                            }else{
                                jugada.jugadas = jugada.jugadas + 1;
                                jugada = activarJugador(jugada);
                                callback(null,sala);
                                }
                            }  
                        }
                    }
        }
        else{
        callback(null,sala); //Seguro para evitar que reescriban partida ganada 
        }
    },
        //Cuarta etapa, guardamos resultados otra vez, pisandolos.
        function(sala,callback){
            client.set(idsala,JSON.stringify(sala),redis.print);
            callback(null,sala);
        }
    ],
    function(error,sala){
        if(error != null){
            throw error;
        }
        cb(error,sala);
    });
//return jugada;   
}

function activarJugador(jugada){
    if(jugada.TurnoJugador1 == true){
        jugada.TurnoJugador1=false;
        jugada.TurnoJugador2=true;
    }else{
        jugada.TurnoJugador2=false;
        jugada.TurnoJugador1=true;
    }
    return jugada;         
}

module.exports.CreateRoom = function (nombre){

    var Tateti = ["","","","","","","","",""];

    var jugada = {
        'tateti' : Tateti,
        'TurnoJugador1': true,
        'TurnoJugador2': false,
        'jugadas': 0,
        'ganador':"",
    };
    var sala = {
        'idsala':"",
        'nombre':"",
        'jugada': jugada,
    };
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var id = crypto.randomBytes(20).toString('hex'); 
    sala.idsala = id;
    sala.nombre = nombre;
    sala=JSON.stringify(sala);
    client.set(id, sala, redis.print);
    sala=JSON.parse(sala);
    return sala;
};

var GetRoom = function(idsala,cb){
    async.series([
        function(callback){
            client.get(idsala, function(err, result){
                if(err!=null){
                    throw err;
                }
                callback(null, result);
            });
        }
    ],function(err,result){
        if(err != null){
            throw err;
        }
        cb(err, result);
    });
};


module.exports.JugadaPrincipal = JugadaPrincipal;
module.exports.GetRoom = GetRoom;