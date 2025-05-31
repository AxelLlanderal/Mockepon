const express = require('express');
const cors = require('cors');
const app = express();
const jugadores = []

app.use(cors()); // Permite todas las solicitudes desde cualquier origen
app.use(express.json())

class Jugador {
  constructor(id) {
    this.id = id;
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon;
  }
}

// Clase Mokepon
class Mokepon {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

app.get('/unirse', (req, res) => {
  const id = `${Math.random()}`;
  const jugador = new Jugador(id);
  jugadores.push(jugador);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});

// Endpoint para asignar un mokepon a un jugador
app.post("/mokepon/:jugadorid", (req, res) => {
  const jugadorId = req.params.jugadorid || "";
  const nombre = req.body.mokepon || "";

  const mokepon = new Mokepon(nombre);

  const jugadorIndex = jugadores.findIndex((jugador) => jugador.id === jugadorId);

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarMokepon(mokepon);
    console.log("Jugador:", jugadores[jugadorIndex]);
  } else {
    console.log("Jugador no encontrado:", jugadorId);
  }

  res.end();
});


app.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080')
})