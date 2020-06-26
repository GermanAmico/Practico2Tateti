export class ISala{
    static idsala: String="";
    nombre: String="";
    jugada: Ijugada= new Ijugada();
}

class Ijugada{
    tateti:String[] = [];
    TurnoJugador1:Boolean = true;
    TurnoJugador2:Boolean = false;
    jugadas:Number = 0;
    ganador:String = "";
}

