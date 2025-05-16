// Referencias a elementos del DOM
const selectorAsignatura = document.getElementById('selector-asignatura');
const listaAsignaturas = document.getElementById('lista-asignaturas');
const selectorUnidad = document.getElementById('selector-unidad');
const descripcionAsignatura = document.getElementById('descripcion-asignatura');
const listaUnidades = document.getElementById('lista-unidades');
const testContainer = document.getElementById('test-container');
const tituloUnidad = document.getElementById('titulo-unidad');
const numeroPreg = document.getElementById('numero-pregunta');
const textoPreg = document.getElementById('texto-pregunta');
const opcionesContainer = document.getElementById('opciones-container');
const resultado = document.getElementById('resultado');
const mensajeResultado = document.getElementById('mensaje-resultado');
const explicacionResultado = document.getElementById('explicacion-resultado');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const contadorPreguntas = document.getElementById('contador-preguntas');
const aciertosSpan = document.getElementById('aciertos');
const totalRespondidasSpan = document.getElementById('total-respondidas');
const totalPreguntasSpan = document.getElementById('total-preguntas');
const btnVolver = document.getElementById('btn-volver');


// Variables globales
let unidades = [];
let unidadActual = null;
let asignaturaActual = null;
let preguntaActual = 0;
let respuestasUsuario = {};
let aciertos = 0;
let totalRespondidas = 0;
let preguntasTest = []; // Array para almacenar las preguntas del test actual


document.addEventListener('DOMContentLoaded', function() {    // Eventos para los botones de navegación
    cargarAsignaturas();
    
    btnAnterior.addEventListener('click', () => {
        if (preguntaActual > 0) {
            preguntaActual--;
            mostrarPregunta();
        }
    });
    
    btnSiguiente.addEventListener('click', () => {
        if (preguntaActual < preguntasTest.length - 1) {            
            preguntaActual++;
            mostrarPregunta();
        }
    });
    
    // Evento para volver a la selección de unidades
    btnVolver.addEventListener('click', () => {
        // Reiniciar contadores al volver al menú principal
        preguntaActual = 0;
        respuestasUsuario = {};
        aciertos = 0;
        totalRespondidas = 0;
        aciertosSpan.textContent = aciertos;
        totalRespondidasSpan.textContent = totalRespondidas;
        
        // Ocultar el contenido de la nota y mostrar el contenido del test
        document.getElementById('contenido-nota').style.display = 'none';
        document.getElementById('contenido-test').style.display = 'block';
        
        // Restaurar la visibilidad de los elementos del test que podrían estar ocultos
        document.getElementById('pregunta-container').style.display = 'block';
        document.getElementById('navegacion').style.display = 'block';
        document.getElementById('puntuacion').style.display = 'block';
        
        // Eliminar el resumen de respuestas si existe
        const resumenRespuestas = document.getElementById('resumen-respuestas');
        if (resumenRespuestas) {
            document.getElementById('contenido-test').removeChild(resumenRespuestas);
        }
        
        testContainer.style.display = 'none';
        selectorUnidad.style.display = 'block';
    });
});
    //Funcion temporizador para cangar siguiente pregunta tras responder
    function cambiarPregunta() {
        setTimeout(() => {
            if (preguntaActual < preguntasTest.length - 1) {
                preguntaActual++;
                mostrarPregunta(); 
            }
        }, 1500);
    }

    function cargarAsignaturas() {       
        selectorUnidad.style.display = 'none';        
        selectorAsignatura.style.display = 'block';
        document.getElementById("portada").style.display = 'block'; // Mostrar la portada al cargar la aplicación
        listaAsignaturas.innerHTML = ''; // Limpiar la lista de asignaturas
        // Resetear la asignatura actual para evitar que se muestre el nombre anterior
        asignaturaActual = null;
        descripcionAsignatura.textContent = '';
        const asignaturas = [
            { id: 'servidor', nombre: 'Desarrollo Web en Entorno Servidor' },
            { id: 'cliente', nombre: 'Desarrollo Web en Entorno Cliente' },
            { id: 'diseno', nombre: 'Diseño de Interfaces Web' }
        ];

        asignaturas.forEach(asignatura => {
            const btnAsignatura = document.createElement('button');
            btnAsignatura.textContent = asignatura.nombre;
            btnAsignatura.className = 'boton';
            btnAsignatura.addEventListener('click', () => {
                asignaturaActual = asignatura.nombre;
                descripcionAsignatura.textContent = asignaturaActual;
                cargarDatos(asignatura.id);
            });
            listaAsignaturas.appendChild(btnAsignatura);
        });
        
    }
    async function mejoraFetch(url){
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el archivo JSON');
                }
                return response.json();
            })
            .then(data => {
                unidades = data;
                mostrarUnidades();  
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar el test. Por favor, intenta de nuevo más tarde.');
            });
    }
    function cargarDatos(asignatura) {     
        // Cargar datos del JSON
        switch (asignatura) {
                case 'servidor':
                    mejoraFetch('DW_entorno_servidor.json');
                    break;                 
                case 'cliente':
                    mejoraFetch('DW_entorno_cliente.json');
                    break;
                case 'diseno':
                    mejoraFetch('Diseno_interfaces_web.json');
                    break;
                        
                default:
                    console.error('Asignatura no válida:', asignatura);
                    alert('Error al cargar la asignatura. Por favor, intenta de nuevo más tarde.');
                    break;
            }
        document.getElementById("portada").style.display = 'none'; // Ocultar la portada al cargar la asignatura
    }
        
    // Mostrar lista de unidades disponibles
    function mostrarUnidades() {           
        selectorUnidad.style.display = 'block';
        selectorAsignatura.style.display = 'none';
        listaUnidades.innerHTML = '';
        
        // Añadir botón para test general
        const btnTestGeneral = document.createElement('button');
        btnTestGeneral.textContent = 'TEST GENERAL (Todas las unidades)';
        btnTestGeneral.className = 'boton boton3';
        btnTestGeneral.addEventListener('click', () => crearTestGeneral());
        listaUnidades.appendChild(btnTestGeneral);
        
        // Añadir botones para cada unidad
        unidades.forEach((unidad, index) => {
            const btnUnidad = document.createElement('button');
            btnUnidad.textContent = unidad.titulo;
            btnUnidad.className = 'boton boton3';
            btnUnidad.addEventListener('click', () => seleccionarUnidad(index));
            listaUnidades.appendChild(btnUnidad);
        });
    }
    
    // Seleccionar una unidad y mostrar su primer pregunta
    function seleccionarUnidad(index) {
        unidadActual = index;
        preguntaActual = 0;
        respuestasUsuario = {};
        aciertos = 0;
        totalRespondidas = 0;
        aciertosSpan.textContent = aciertos;
        totalRespondidasSpan.textContent = totalRespondidas;
        
        // Usar las preguntas de la unidad seleccionada
        preguntasTest = unidades[unidadActual].preguntas;
        // Actualizar el contador de preguntas totales
        totalPreguntasSpan.textContent = preguntasTest.length;
        
        // Ocultar el contenido de la nota y mostrar el contenido del test
        document.getElementById('contenido-nota').style.display = 'none';
        document.getElementById('contenido-test').style.display = 'block';       
        // Restaurar la visibilidad de los elementos del test que podrían estar ocultos
        document.getElementById('pregunta-container').style.display = 'block';
        document.getElementById('navegacion').style.display = 'block';
        document.getElementById('puntuacion').style.display = 'block';
        
        // Eliminar el resumen de respuestas si existe
        const resumenRespuestas = document.getElementById('resumen-respuestas');
        if (resumenRespuestas) {
            document.getElementById('contenido-test').removeChild(resumenRespuestas);
        }
        
        // Mostrar el contenedor del test y ocultar el selector de unidades
        selectorUnidad.style.display = 'none';
        testContainer.style.display = 'block';
        
        // Mostrar título de la unidad
        tituloUnidad.textContent = unidades[unidadActual].titulo;
        
        // Mostrar la primera pregunta
        mostrarPregunta();
    }
    
    // Crear test general con preguntas aleatorias de todas las unidades
    function crearTestGeneral() {
        // Reiniciar contadores
        preguntaActual = 0;
        respuestasUsuario = {};
        aciertos = 0;
        totalRespondidas = 0;
        aciertosSpan.textContent = aciertos;
        totalRespondidasSpan.textContent = totalRespondidas;
        
        // Ocultar el contenido de la nota y mostrar el contenido del test
        document.getElementById('contenido-nota').style.display = 'none';
        document.getElementById('contenido-test').style.display = 'block';               
        // Restaurar la visibilidad de los elementos del test que podrían estar ocultos
        document.getElementById('pregunta-container').style.display = 'block';
        document.getElementById('navegacion').style.display = 'block';
        document.getElementById('puntuacion').style.display = 'block';
        
        // Eliminar el resumen de respuestas si existe
        const resumenRespuestas = document.getElementById('resumen-respuestas');
        if (resumenRespuestas) {
            document.getElementById('contenido-test').removeChild(resumenRespuestas);
        }
        
        // Recopilar todas las preguntas de todas las unidades
        preguntasTest = [];
        unidades.forEach(unidad => {
            // Añadir información de la unidad a cada pregunta para mostrarla en el test
            const preguntasConUnidad = unidad.preguntas.map(pregunta => {
                return {...pregunta, unidad: unidad.titulo};
            });
            preguntasTest = preguntasTest.concat(preguntasConUnidad);
        });
        
        // Mezclar las preguntas aleatoriamente
        preguntasTest = mezclarArray(preguntasTest);
        
        // Actualizar el contador de preguntas totales
        totalPreguntasSpan.textContent = preguntasTest.length;
        
        // Configurar como test general
        unidadActual = 'general';
        
        // Mostrar el contenedor del test y ocultar el selector de unidades
        selectorUnidad.style.display = 'none';
        testContainer.style.display = 'block';
        
        // Mostrar título del test general
        tituloUnidad.textContent = 'TEST GENERAL (Todas las unidades)';
        
        // Mostrar la primera pregunta
        mostrarPregunta();
    }
    
    // Función para mezclar un array (algoritmo Fisher-Yates)
    function mezclarArray(array) {
        const nuevoArray = [...array];
        for (let i = nuevoArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
        }
        return nuevoArray;
    }
    
    // Mostrar la pregunta actual
    function mostrarPregunta() {
           
        selectorAsignatura.style.display = 'none';
        const pregunta = preguntasTest[preguntaActual];
        
        // Actualizar número y texto de la pregunta      
        numeroPreg.textContent = `Pregunta ${pregunta.numero}`;
        
        textoPreg.textContent = pregunta.pregunta;
        
        // Limpiar opciones anteriores
        opcionesContainer.innerHTML = '';
        
        // Generar opciones
        for (const [letra, texto] of Object.entries(pregunta.opciones)) {
            const opcionDiv = document.createElement('div');
            opcionDiv.className = 'opcion';
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'opcion';
            radioInput.id = `opcion-${letra}`;
            radioInput.value = letra;
            
            // Si el usuario ya respondió esta pregunta, marcar su respuesta
            if (respuestasUsuario[preguntaActual] === letra) {
                radioInput.checked = true;
            }
            
            radioInput.addEventListener('change', () =>{
                verificarRespuesta(letra);
                //Pasar a la siguiente pregunta al seleccionar una opción
                if (preguntaActual < preguntasTest.length - 1) {
                    cambiarPregunta();
                } else {
                    mostrarResultado(respuestasUsuario[preguntaActual]);
                }

            });           
            
            const label = document.createElement('label');
            label.htmlFor = `opcion-${letra}`;
            label.textContent = `${letra}. ${texto}`;
            
            opcionDiv.appendChild(radioInput);
            opcionDiv.appendChild(label);
            opcionesContainer.appendChild(opcionDiv);
        }
        
        // Actualizar contador de preguntas
        contadorPreguntas.textContent = `${preguntaActual + 1} de ${preguntasTest.length}`;
        
        // Habilitar/deshabilitar botones de navegación
        btnAnterior.disabled = preguntaActual === 0;
        btnSiguiente.disabled = preguntaActual === preguntasTest.length - 1;
        
        // Ocultar resultado si se está mostrando
        resultado.style.display = 'none';
        
        // Si ya se respondió esta pregunta, mostrar el resultado
        if (respuestasUsuario[preguntaActual]) {
            mostrarResultado(respuestasUsuario[preguntaActual]);
        }
    }
    
    // Verificar la respuesta seleccionada
    function verificarRespuesta(respuestaSeleccionada) {
        const pregunta = preguntasTest[preguntaActual];
        
        // Si es la primera vez que responde esta pregunta
        if (!respuestasUsuario[preguntaActual]) {
            totalRespondidas++;
            totalRespondidasSpan.textContent = totalRespondidas;
            
            if (respuestaSeleccionada === pregunta.respuesta_correcta) {
                aciertos++;
                aciertosSpan.textContent = aciertos;
            }
        } else if (respuestasUsuario[preguntaActual] !== respuestaSeleccionada) {
            // Si cambia su respuesta
            if (respuestasUsuario[preguntaActual] === pregunta.respuesta_correcta && 
                respuestaSeleccionada !== pregunta.respuesta_correcta) {
                // Si antes era correcta y ahora es incorrecta
                aciertos--;
            } else if (respuestasUsuario[preguntaActual] !== pregunta.respuesta_correcta && 
                       respuestaSeleccionada === pregunta.respuesta_correcta) {
                // Si antes era incorrecta y ahora es correcta
                aciertos++;
            }
            aciertosSpan.textContent = aciertos;
        }
        
        // Guardar la respuesta del usuario
        respuestasUsuario[preguntaActual] = respuestaSeleccionada;
        
        // Mostrar resultado
        mostrarResultado(respuestaSeleccionada);

        // Mostrar nota final si se ha respondido a todas las preguntas
        if (preguntaActual === preguntasTest.length - 1) {
            setTimeout(() => {
                    document.getElementById('contenido-test').style.display = 'none';
                    document.getElementById('contenido-nota').style.display = 'block';
                    mostrarNota();                   
            }, 1500);
                  

        }
    }
    
    // Mostrar el resultado de la respuesta
    function mostrarResultado(respuestaSeleccionada) {
        const pregunta = preguntasTest[preguntaActual];
        resultado.style.display = 'block';
        
        if (respuestaSeleccionada === pregunta.respuesta_correcta) {
            mensajeResultado.textContent = '¡Correcto!';
            mensajeResultado.style.color = 'green';
        } else {
            mensajeResultado.textContent = 'Incorrecto. La respuesta correcta es: ' + 
                                          pregunta.respuesta_correcta;
            mensajeResultado.style.color = 'red';
        }        
        explicacionResultado.textContent = pregunta.texto_respuesta_correcta;

    }

    function mostrarNota() {
        let nota = (aciertos / totalPreguntasSpan.textContent) * 10;
        nota = nota.toFixed(2); 
        console.log('Nota:', nota); // Mostrar la nota en la consola para depuración

        const notaFinal = document.getElementById('nota-final');
        notaFinal.textContent = nota;

        const mensajeNota = document.getElementById('mensaje-final');
        if (nota >= 5) {
            mensajeNota.textContent = '¡Felicidades! Has aprobado el test.';
            mensajeNota.style.color = 'green';
        } else {
            mensajeNota.textContent = 'Lo siento, no has aprobado el test.';
            mensajeNota.style.color = 'red';
        }

        // Añadir botón para verificar respuestas
        const contenidoNota = document.getElementById('contenido-nota');
        
        // Eliminar botón anterior si existe
        const btnVerificarAnterior = document.getElementById('btn-verificar-respuestas');
        if (btnVerificarAnterior) {
            contenidoNota.removeChild(btnVerificarAnterior);
        }
        
        // Crear nuevo botón
        const btnVerificarRespuestas = document.createElement('button');
        btnVerificarRespuestas.id = 'btn-verificar-respuestas';
        btnVerificarRespuestas.className = 'boton2';
        btnVerificarRespuestas.textContent = 'Verificar Respuestas';
        btnVerificarRespuestas.addEventListener('click', verificarTodasLasRespuestas);
        contenidoNota.appendChild(btnVerificarRespuestas);
    }
    
    // Función para verificar todas las respuestas y mostrar un resumen
    function verificarTodasLasRespuestas() {
        // Ocultar el contenido de la nota
        document.getElementById('contenido-nota').style.display = 'none';
        
        // Mostrar el contenido del test
        document.getElementById('contenido-test').style.display = 'block';
        
        // Eliminar el resumen anterior si existe
        const resumenAnterior = document.getElementById('resumen-respuestas');
        if (resumenAnterior) {
            document.getElementById('contenido-test').removeChild(resumenAnterior);
        }
        
        // Crear un contenedor para el resumen de respuestas
        const resumenContainer = document.createElement('div');
        resumenContainer.id = 'resumen-respuestas';
        resumenContainer.className = 'resumen-container';
        
        // Crear título para el resumen
        const tituloResumen = document.createElement('h2');
        tituloResumen.textContent = 'Resumen de Respuestas';
        tituloResumen.className = 'titulos';
        resumenContainer.appendChild(tituloResumen);
        
        // Crear lista de preguntas y respuestas
        preguntasTest.forEach((pregunta, index) => {
            const preguntaDiv = document.createElement('div');
            preguntaDiv.className = 'pregunta-resumen';
            
            // Número y texto de la pregunta
            const preguntaTexto = document.createElement('p');
            preguntaTexto.innerHTML = `<strong>Pregunta ${pregunta.numero}:</strong> ${pregunta.pregunta}`;
            preguntaDiv.appendChild(preguntaTexto);
            
            // Respuesta del usuario
            const respuestaUsuarioTexto = document.createElement('p');
            const respuestaUsuario = respuestasUsuario[index];
            
            if (respuestaUsuario) {
                const esCorrecta = respuestaUsuario === pregunta.respuesta_correcta;
                respuestaUsuarioTexto.innerHTML = `<strong>Tu respuesta:</strong> ${respuestaUsuario}. ${pregunta.opciones[respuestaUsuario]}`;
                respuestaUsuarioTexto.style.color = esCorrecta ? 'green' : 'red';
            } else {
                respuestaUsuarioTexto.innerHTML = '<strong>No respondida</strong>';
                respuestaUsuarioTexto.style.color = 'orange';
            }
            preguntaDiv.appendChild(respuestaUsuarioTexto);
            
            // Respuesta correcta
            const respuestaCorrectaTexto = document.createElement('p');
            respuestaCorrectaTexto.innerHTML = `<strong>Respuesta correcta:</strong> ${pregunta.respuesta_correcta}. ${pregunta.opciones[pregunta.respuesta_correcta]}`;
            respuestaCorrectaTexto.style.color = 'green';
            preguntaDiv.appendChild(respuestaCorrectaTexto);            
           
            
            // Añadir separador
            const separador = document.createElement('hr');
            preguntaDiv.appendChild(separador);
            
            resumenContainer.appendChild(preguntaDiv);
        });
        
        // Botón para volver a la nota
        const btnVolverNota = document.createElement('button');
        btnVolverNota.textContent = 'Volver a la Nota';
        btnVolverNota.className = 'boton2';
        btnVolverNota.addEventListener('click', () => {
            // Eliminar el resumen
            if (document.getElementById('resumen-respuestas')) {
                document.getElementById('contenido-test').removeChild(document.getElementById('resumen-respuestas'));
            }
            
            // Ocultar el contenido del test y mostrar el contenido de la nota
            document.getElementById('contenido-test').style.display = 'none';
            document.getElementById('contenido-nota').style.display = 'block';
        });
        resumenContainer.appendChild(btnVolverNota);
        
        // Añadir el resumen al contenido del test
        document.getElementById('contenido-test').appendChild(resumenContainer);
        
        // Ocultar elementos del test que no son necesarios para el resumen
        document.getElementById('pregunta-container').style.display = 'none';
        document.getElementById('navegacion').style.display = 'none';
        document.getElementById('puntuacion').style.display = 'none';
    }
    
   