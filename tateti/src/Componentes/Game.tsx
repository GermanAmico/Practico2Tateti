import React,{useState} from 'react';
import {Board} from "./Board";
import { RouteComponentProps } from "react-router-dom"

export function Game(props: RouteComponentProps<{ idsala: string }>) {
  console.log("ID SALA EN GAME " + props.match.params.idsala);
  return (
    <div className="game">
      <div className="game-board">
        <Board value={props.match.params.idsala}/>
      </div>
      <div className="game-info">
      </div>
    </div>
  );
}