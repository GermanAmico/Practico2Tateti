import React,{useState, useEffect} from 'react';
import Square from './Square';
import axios from "axios";

export function Board(props:any){
    let [sala,setSala]= useState({
      'idsala':"",
      'nombre':"",
      'jugada':{
        'tateti':[""],
        'TurnoJugador1':true,
        'TurnoJugador2':false,
        'jugadas':0,
        'ganador':""
      }
    });
    const LocalStorage = window.localStorage;
    let handleClick=(i:number)=> {
      
      let squareCont = sala.jugada.tateti.slice();
      squareCont[i] = sala.jugada.TurnoJugador1 ? 'X' : 'O';
      updateSala(sala.idsala,squareCont[i],i);
    }

    let renderSquare=(i:number)=> {
      return (
        <Square
          value={sala.jugada.tateti[i]}
          onClick={() => handleClick(i)}
        />
      );
    }


    const createSala = () =>{
      axios.post('http://localhost:3001/turn/room/create', {'nombre':'UnaSalaHechaEnReact :D'}).then(response=>{
        LocalStorage.setItem('currentsala',response.data.idsala);
        setSala(response.data);
      }).catch((err)=>{console.log(err)});
    }

    
    const updateSala = (idsala:any, valor:any, posicion:any) => {
      axios.put('http://localhost:3001/turn/',{'idsala':idsala,'valor':valor,'posicion':posicion}).then(response=>{
        setSala(response.data);
      });
    }

    const MostrarGanador =() => {
      return (<div>Ganador: {sala.jugada.ganador} </div>)
    };


    const getSala= (idsala:any)=>{
      axios.get('http://localhost:3001/turn/room?idsala='+idsala).then(response => {
        LocalStorage.setItem('currentsala',idsala);
        setSala(response.data);
      });
    }

    useEffect(() => {
      let href =  window.location.href;
      if(href.includes("/sala/crear") && sala.idsala===""){
        LocalStorage.setItem('currentPlayer','jugador1');
        createSala();
      }
      if(href.includes("/sala/unirse") && sala.idsala === ""){
        LocalStorage.setItem('currentPlayer','jugador2');
        getSala(props.value);
      }
    });
    useEffect(()=>{
      let currentplayer = LocalStorage.getItem('currentPlayer');
      if(currentplayer === 'jugador1' && !sala.jugada.TurnoJugador1===false){
        const timer = setInterval(()=>{
          console.log("Timer jugador 1 corriendo...");
          getSala(LocalStorage.getItem('currentsala'));
        },1000);
        return () => clearInterval(timer);
      }
    },[]);
    useEffect(()=>{
      let currentplayer = LocalStorage.getItem('currentPlayer');
      if(currentplayer === 'jugador2' && sala.jugada.TurnoJugador2===false){
        const timer = setInterval(()=>{
          console.log("Timer jugador 2 corriendo... " + sala.jugada.TurnoJugador2 );
          getSala(LocalStorage.getItem('currentsala'));
        },1000);
        return () => clearInterval(timer);
      }
    });

    if(sala.jugada.ganador !== ""){
      return(<h1>RESULTADO GANADOR: {sala.jugada.ganador}</h1>);
    }else{ 
    if(LocalStorage.getItem('currentPlayer') === 'jugador2' && sala.jugada.TurnoJugador2===false){
      return(<h1>Esperando al Jugador 1...</h1>);
    }

    if(LocalStorage.getItem('currentPlayer') === 'jugador1' && sala.jugada.TurnoJugador1===false){
      return(<h1>Esperando al Jugador 2...</h1>);
    }
      return(
        <div>
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
          <div>
            <p>Comparte el ID con un amigo para empezar a jugar: {sala.idsala} </p>
          </div>
        </div>
      );
  }
}