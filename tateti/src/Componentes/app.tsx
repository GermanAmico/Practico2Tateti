import React,{useState} from 'react';
import {BrowserRouter as Router,Route,Link,} from 'react-router-dom';

import {Game} from "./Game";


export default function App(){

   
    let [idsala,setIdsala]= useState("");

    const handleChange=(event:any)=> {
        setIdsala(event.target.value);
        
        console.log(idsala);
    };
    
    return(
      <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/sala/crear">Nueva partida</Link>
              </li>
              <li>
                <Link to="/sala/entrar">Unirse a partida</Link>
              </li>
            </ul>
            </nav>
            <Route path="/">
              <h1>Tateti inicio</h1>
            </Route>
            <Route path="/sala/crear" component={Game}/>
            <Route path="/sala/entrar">
              <input type="text" onChange={handleChange} name="idsala"/>
              <Link to={`/sala/unirse/${idsala}`}>Unirse a {idsala}</Link>
            </Route>
            <Route exact path="/sala/unirse/:idsala" component={Game}/> 
          </Router>
    );     
}

   