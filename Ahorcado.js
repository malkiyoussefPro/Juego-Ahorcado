document.addEventListener('DOMContentLoaded', function () {
    const btnJugar = id('jugar');
    const reiniciarBtn = id('jugar'); // Cambiado a 'jugar'
    let palabras = ["mysql", "java", "php", "css", "programacion", "javascript", "servidor"];
    let vidas = 7;
    let errores = 0;
    let errores_imagenes = 6;
    let palabraActual = "";
    let juegoGanado = false;
    let intervalo;
    let tiempoAgotadoPerdido = false;
    let tiempoAgotadoGanado = false;
    let letrasAcertadas ;
 
    // Evento de clic en el botón para comenzar el juego
    btnJugar.addEventListener('click', iniciar);
         //bouton jugar de nuevo
         let reiniciar = document.getElementById('reiniciar');
         reiniciar.addEventListener('click', () => {
             
             location.reload();  // Reiniciar el juego
         });

    // Evento de clic en el botón para reiniciar el juego
    reiniciarBtn.addEventListener('click', reiniciarJuego);

    // Función para iniciar el juego
    function iniciar(evento) {
        // Restablecer la imagen del ahorcado
        id('imagen').src = 'imagenes/ahorcado_6.png';
        juegoGanado = false; // Restablecer el estado del juego ganado
        detenerCronometro(); // Detener el cronómetro al reiniciar el juego
        //reiniciarBtn.disabled = true; // Deshabilitar el botón de reinicio

        const parrafo = id('adivinar');
        parrafo.innerHTML = '';

        const cant_palabras = palabras.length;
        const valor_al_azar = obtener_random(0, cant_palabras);
        palabraActual = palabras[valor_al_azar].toLowerCase();
        console.log(palabraActual);

        const cant_letras = palabraActual.length;

        // Crear espacios para cada letra de la palabra
        for (let i = 0; i < cant_letras; i++) {
            const span = document.createElement('span');
            parrafo.appendChild(span);
        }

        // Limpiar el color de fondo de las letras
        const cols = document.querySelectorAll('.col');
        cols.forEach(col => col.style.backgroundColor = "");

        // Quitar y agregar el evento click a las letras
        cols.forEach(col => col.removeEventListener('click', verificarLetra));
        cols.forEach(col => col.addEventListener('click', verificarLetra));

        iniciarCronometro(); // Iniciar el cronómetro
        //
    }

    // Función para verificar la letra seleccionada
    function verificarLetra(event) {

        if (!juegoGanado && vidas > 0) {
            const letra = event.target.innerText.toLowerCase();
            
            if (palabraActual.includes(letra)) {
                event.target.style.backgroundColor = "green";
                actualizarPalabraAdivinada(letra);
            } else {
                event.target.style.backgroundColor = "red";
                    vidas -= 1;
                    id("vidas").innerText = vidas;
                    errores += 1;
                    id("errores").innerText = errores;
                    
                    // Cambiar la imagen del ahorcado
                    id('imagen').src = `imagenes/ahorcado_${errores_imagenes}.png`;
                    errores_imagenes -= 1;
                    
                    if (vidas === 0) {
                        // Quitar eventos click al perder
                        const cols = document.querySelectorAll('.col');
                        cols.forEach(col => col.removeEventListener('click', verificarLetra));
                        mostrarMensajePerdido();
                        reiniciarBtn.disabled = false; // Habilitar el botón de reinicio
                    }
                }
            }
            if(vidas == 0 || ([...spans].every(span => span.innerText !== ''))|| (minutos < 0 && !tiempoAgotado)){
                 clearInterval(intervalo);
        }
        
    }
    // Función para actualizar la palabra adivinada
    function actualizarPalabraAdivinada(letra) {
        const spans = id('adivinar').querySelectorAll('span');
        for (let i = 0; i < palabraActual.length; i++) {
            if (palabraActual[i] === letra) {
                
                spans[i].innerText = letra;
                letrasAcertadas++;
                
            }
        }
        if(letrasAcertadas == palabraActual.length) { 
            detenerCronometro();
       
        }


        // Verificar si se adivinó toda la palabra
        if ([...spans].every(span => span.innerText !== '')) {
            juegoGanado = true;   // Marcar el juego como ganado
            mostrarMensajeGanador();
            detenerCronometro();  // Detener el cronómetro al ganar
            reiniciarBtn.disabled = false; // Habilitar el botón de reinicio
            reiniciarJuego();
        }
    }

    // Función para detener el cronómetro
    function detenerCronometro() {
        clearInterval(intervalo);
    }

// En la función mostrarMensajePerdido()
function mostrarMensajePerdido() {
    const mensajePerdido = document.getElementById('resultado');
    mensajePerdido.style.color = 'red';

    mensajePerdido.innerText = tiempoAgotadoPerdido ? "¡Tiempo agotado! Has perdido." : "¡Has perdido! Inténtalo de nuevo.!";

    setTimeout(() => {
        mensajePerdido.remove();
    }, 3000);
    
  
}

// En la función mostrarMensajeGanador()
function mostrarMensajeGanador() {
    const mensajeGanador = document.getElementById('resultado');
    mensajeGanador.style.color = 'green';
    mensajeGanador.innerText = tiempoAgotadoGanado ? "¡Has ganado! ¡Bien hecho!" : "¡Has ganado! Inténtalo de nuevo si quieres.!";

    setTimeout(() => {
        mensajeGanador.remove();
    }, 3000);
  
}


    // Función para reiniciar el juego
    function reiniciarJuego() {
        vidas = 7;
        errores = 0;
        id("vidas").innerText = vidas;
        id("errores").innerText = errores;

        // Limpiar el color de fondo de las letras al reiniciar
        const cols = document.querySelectorAll('.col');
        cols.forEach(col => col.style.backgroundColor = "");

    }

    // Función para obtener un número aleatorio dentro de un rango
    function obtener_random(num_min, num_max) {
        const amplitud_valores = num_max - num_min;
        return Math.floor(Math.random() * amplitud_valores + num_min);
    }

    // Función de utilidad para obtener elementos del DOM por ID
    function id(str) {
        return document.getElementById(str);
    }

    const rowCronometro = document.getElementById('rowCronometro');
    const minutosElement = document.getElementById('minutos');
    const segundosElement = document.getElementById('segundos');
    const milisegundosElement = document.getElementById('milisegundos');

    let minutos = 1;
    let segundos = 0;
    let milisegundos = 0;

    // Iniciar el cronómetro
    function iniciarCronometro() {
        intervalo = setInterval(actualizarCronometro, 1000);
    }

    // Detener el cronómetro
    function detenerCronometro() {
        clearInterval(intervalo);
    }

    // Actualizar el cronómetro
    function actualizarCronometro() {
        milisegundos -= 100;

        if (milisegundos < 0) {
            milisegundos = 900;
            segundos -= 1;
        }

        if (segundos < 0) {
            segundos = 59;
            minutos -= 1;
        }

        if (minutos < 0 && !tiempoAgotado) {
            detenerCronometro();
            tiempoAgotado = true;
            mostrarMensajePerdido();
            return;
        }

        actualizarElementosCronometro();
    }

    // Actualizar los elementos del cronómetro en el DOM
    function actualizarElementosCronometro() {
        minutosElement.textContent = minutos < 10 ? '0' + minutos : minutos;
        segundosElement.textContent = segundos < 10 ? '0' + segundos : segundos;
        milisegundosElement.textContent = milisegundos < 10 ? '00' + milisegundos : milisegundos < 100 ? '0' + milisegundos : milisegundos;
    }

    // Evento de clic en el botón para iniciar el cronómetro
    rowCronometro.addEventListener('click', function () {
        iniciarCronometro();
    });

    // Evento de clic en el botón para detener el cronómetro
    rowCronometro.addEventListener('dblclick', function () {
        detenerCronometro();
    });

    // Iniciar el juego al cargar la página
    iniciar();
});
