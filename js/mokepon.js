// Variables Globales
let vidasJugador = 3;
let vidasEnemigo = 3;
let juegoTerminado = false; 
let jugadorId = null;
let mascotaJugador;

// Función para iniciar el juego
function iniciarJuego() {
    //conectarse al servidor
    unirseAlJuego();
    let sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
    sectionSeleccionarAtaque.style.display = 'none';

    let sectionReiniciar = document.getElementById('reiniciar');
    sectionReiniciar.style.display = 'none';

    let botonMascotaJugador = document.getElementById('boton-mascota');
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador);

    // Eventos para las imágenes de ataque
    document.getElementById('ataque-fuego').addEventListener('click', () => ataqueJugador('FUEGO'));
    document.getElementById('ataque-agua').addEventListener('click', () => ataqueJugador('AGUA'));
    document.getElementById('ataque-tierra').addEventListener('click', () => ataqueJugador('TIERRA'));

    let botonReiniciar = document.getElementById('boton-reiniciar');
    botonReiniciar.addEventListener('click', reiniciarJuego);
}

// Nueva función para conectarse al servidor
function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(res => {
            if (res.ok) {
                res.text().then(respuesta => {
                    console.log("ID recibido del servidor:", respuesta);
                    jugadorId = respuesta;
                });
            } else {
                console.error("Error en la respuesta del servidor");
            }
        })
        .catch(error => {
            console.error("Error en la petición fetch:", error);
        });
}

// Función para que el jugador seleccione una mascota
function seleccionarMascotaJugador() {
    const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota");
    sectionSeleccionarMascota.style.display = 'none';

    const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
    sectionSeleccionarAtaque.style.display = 'block';

    const inputHipodoge = document.getElementById('hipodoge');
    const inputCapipepo = document.getElementById('capipepo');
    const inputRatigueya = document.getElementById('ratigueya');

    const spanMascotaJugador = document.getElementById('mascota-jugador');
    const imgMascotaJugador = document.getElementById('img-mascota-jugador');

    if (inputHipodoge.checked) {
    mascotaJugador = 'Hipodoge';
    spanMascotaJugador.innerHTML = 'Hipodoge';
    imgMascotaJugador.src = './imagenes/Personaje_Agua.png';
    } else if (inputCapipepo.checked) {
    mascotaJugador = 'Capipepo';
    spanMascotaJugador.innerHTML = 'Capipepo';
    imgMascotaJugador.src = './imagenes/Personaje_Tierra.png';
    } else if (inputRatigueya.checked) {
    mascotaJugador = 'Ratigueya';
    spanMascotaJugador.innerHTML = 'Ratigueya';
    imgMascotaJugador.src = './imagenes/Personaje_Fuego.png';
    }else {
    alert('Selecciona una mascota');
    sectionSeleccionarMascota.style.display = 'block';
    return;
}

    imgMascotaJugador.classList.add('combate');

    seleccionarMokepon(mascotaJugador);
    // Activar animación de combate

    seleccionarMascotaEnemigo();
}

function seleccionarMascotaEnemigo() {
    const ataqueAleatorio = aleatorio(1, 3);
    const spanMascotaEnemigo = document.getElementById('mascota-enemigo');
    const imgMascotaEnemigo = document.getElementById('img-mascota-enemigo');

    if (ataqueAleatorio === 1) {
        spanMascotaEnemigo.innerHTML = 'Hipodoge';
        imgMascotaEnemigo.src = './imagenes/Personaje_Agua.png';
    } else if (ataqueAleatorio === 2) {
        spanMascotaEnemigo.innerHTML = 'Capipepo';
        imgMascotaEnemigo.src = './imagenes/Personaje_Tierra.png';
    } else {
        spanMascotaEnemigo.innerHTML = 'Ratigueya';
        imgMascotaEnemigo.src = './imagenes/Personaje_Fuego.png';
    }
    

    // Activar animación de combate
    imgMascotaEnemigo.classList.add('combate');
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mokepon: mascotaJugador })
    });
}

// Función para manejar el combate
function combate(ataqueJugador, ataqueEnemigo) {
    if (juegoTerminado) return; // Si el juego ha terminado, no hacer nada

    const explosionJugador = document.getElementById('explosion-jugador');
    const explosionEnemigo = document.getElementById('explosion-enemigo');

    let spanVidasJugador = document.querySelector('#mascota-jugador').nextElementSibling;
    let spanVidasEnemigo = document.querySelector('#mascota-enemigo').nextElementSibling;

    if (ataqueJugador == ataqueEnemigo) {
        crearMensaje("HAY EMPATE", ataqueJugador, ataqueEnemigo);
    } else if (
        ataqueJugador == 'FUEGO' && ataqueEnemigo == 'TIERRA' ||
        ataqueJugador == 'AGUA' && ataqueEnemigo == 'FUEGO' ||
        ataqueJugador == 'TIERRA' && ataqueEnemigo == 'AGUA'
    ) {
        crearMensaje("GANASTE", ataqueJugador, ataqueEnemigo);
        vidasEnemigo--;
        if (vidasEnemigo < 0) vidasEnemigo = 0;
        document.querySelectorAll('.estado-juego .vidas')[1].innerHTML = vidasEnemigo;

        // Mostrar explosión en enemigo
        explosionEnemigo.style.display = 'block';
        setTimeout(() => explosionEnemigo.style.display = 'none', 1000);
    } else {
        crearMensaje("PERDISTE", ataqueJugador, ataqueEnemigo);
        vidasJugador--;
        if (vidasJugador < 0) vidasJugador = 0;
        document.querySelectorAll('.estado-juego .vidas')[0].innerHTML = vidasJugador;

        // Mostrar explosión en jugador
        explosionJugador.style.display = 'block';
        setTimeout(() => explosionJugador.style.display = 'none', 1000);
    }

    revisarVidas();
}

// Función para revisar vidas
function revisarVidas() {
    if (vidasEnemigo == 0) {
        crearMensajeFinal('Felicitaciones, GANASTE');
        juegoTerminado = true;
    } else if (vidasJugador == 0) {
        crearMensajeFinal('Lo siento, PERDISTE');
        juegoTerminado = true;
    }
}

// Función de ataque del jugador
function ataqueJugador(ataque) {
    if (juegoTerminado) return; 
    let ataqueEnemigo = ataqueAleatorioEnemigo(); 
    combate(ataque, ataqueEnemigo); 
}


// Función para ataque aleatorio enemigo
function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(1, 3);
    let ataqueEnemigo;
    
    if (ataqueAleatorio == 1) {
        ataqueEnemigo = 'FUEGO';
    } else if (ataqueAleatorio == 2) {
        ataqueEnemigo = 'AGUA';
    } else {
        ataqueEnemigo = 'TIERRA';
    }
    return ataqueEnemigo;
}

// Función para crear mensajes de ataque
function crearMensaje(resultado, ataqueJugador, ataqueEnemigo) {
    let sectionMensajes = document.getElementById('mensajes');
    sectionMensajes.innerHTML = '';
    let parrafo = document.createElement('p');
    parrafo.innerHTML = `Tu mascota atacó con ${ataqueJugador}, la mascota del enemigo atacó con ${ataqueEnemigo} <span class="resultado ${resultado.toLowerCase()}">${resultado}</span>`;
    sectionMensajes.appendChild(parrafo);
}

// Función para crear mensajes finales
function crearMensaje(resultado, ataqueJugador, ataqueEnemigo) {
    let sectionMensajes = document.getElementById('mensajes');
    sectionMensajes.innerHTML = ''; 
    let parrafo = document.createElement('p');
    parrafo.innerHTML = `
        Tu mascota atacó con <strong>${ataqueJugador}</strong>, 
        la mascota del enemigo atacó con <strong>${ataqueEnemigo}</strong> 
        <span class="${resultado.toLowerCase()}">${resultado}</span>`;
    sectionMensajes.appendChild(parrafo);
}
function crearMensajeFinal(mensaje) {
    const resultadoFinal = document.getElementById('resultado-final');
    resultadoFinal.innerHTML = `
        <p style="
            font-size: 24px; 
            font-weight: bold; 
            color: #ff9800; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
            ${mensaje}
        </p>`;
    
    const sectionReiniciar = document.getElementById('reiniciar');
    sectionReiniciar.style.display = 'block';
}
// Función para reiniciar el juego
function reiniciarJuego() {
    location.reload();
}

// Función para aleatorio
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Evento al cargar la página
window.addEventListener('load', iniciarJuego);
