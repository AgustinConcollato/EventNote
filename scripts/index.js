
const OPCIONES_AGREGAR = document.querySelector('#agregarOpciones')
const OPCIONES_CONFIGURACION = document.querySelector('#configuracionOpciones')
const BUSCADOR = document.querySelector('#buscador')
const FORM_BUSCADOR = document.querySelector('#formBuscador')
const CONTENEDOR_RESULTADO = document.querySelector('#contenedorResultados')

const SECCION_CALENDARIO = document.querySelector('#calendario')
const FORM_CREAR_NOTA = document.querySelector('#formNota')
const FORM_CREAR_EVENTO = document.querySelector('#formEvento')
const CATEGORIA_EVENTO = document.querySelector('#categoriaEvento')
const OPCIONES_SELECCIONAR = document.querySelector('#opcionesCategorias')

const CONTENEDOR_NOTAS = document.createElement('div')
const CONTENEDOR_EVENTOS = document.createElement('div')
const NADA_CREADO = document.createElement('div')

const SECCION_NOTAS = document.querySelector('#notas')
const SECCION_EVENTOS = document.querySelector('#eventos')

const BTN_SECCION_EVENTOS = document.querySelector('#seccionEventos')
const BTN_SECCION_NOTAS = document.querySelector('#seccionNotas')
const BTN_SECCION_EVENTOS2 = document.querySelector('#seccionEventos2')
const BTN_SECCION_NOTAS2 = document.querySelector('#seccionNotas2')
const BTN_CALENDARIO_ICON = document.querySelector('#calendarioIcon')
const RECORDATORIO = document.querySelector('#recordatorioEvento')

let notas = JSON.parse(localStorage.getItem('nota')) || []
let eventos = JSON.parse(localStorage.getItem('evento')) || []
let recordatorio = 'hidden'

CONTENEDOR_NOTAS.id = 'contenedorNotas'
CONTENEDOR_EVENTOS.id = 'contenedorEventos'
NADA_CREADO.id = 'nadaCreado'

mostrarNotas()

document.onkeydown = ({ altKey, keyCode }) => {
    if (altKey == true && keyCode == 78) {
        window.location.href = "#crearNotaNueva"
    } else if (altKey == true && keyCode == 69) {
        window.location.href = "#crearEventoNuevo"
        return false
    } else if (keyCode == 27) {
        window.location.href = "#"
    }

}
document.onclick = ({ target }) => {
    target.id == 'agregar' ? OPCIONES_AGREGAR.style.display = 'block' : OPCIONES_AGREGAR.style.display = 'none'
    target.id == 'configuracion' ? OPCIONES_CONFIGURACION.style.display = 'block' : OPCIONES_CONFIGURACION.style.display = 'none'
}

window.onresize = () => {
    if (window.location.hash === '#eventos') {
        if (window.innerWidth <= 1024) {
            SECCION_CALENDARIO.className = 'calendarioOculto'
            BTN_CALENDARIO_ICON.style.display = 'flex'
        } else {
            SECCION_CALENDARIO.className = 'calendarioVisible'
            BTN_CALENDARIO_ICON.style.display = 'none'
        }
    } else {
        BTN_CALENDARIO_ICON.style.display = 'none'
    }
}

RECORDATORIO.onclick = () => {
    if (recordatorio == 'hidden') {
        recordatorio = 'visible'
        RECORDATORIO.style.cssText = 'animation: recordatorio .8s 1;'
        setTimeout(() => {
            RECORDATORIO.className = 'fas fa-bell'
            RECORDATORIO.style.cssText = ''
        }, 1000)

    } else {
        recordatorio = 'hidden'
        RECORDATORIO.style.cssText = 'animation: recordatorio .8s 1;'
        setTimeout(() => {
            RECORDATORIO.className = 'far fa-bell'
            RECORDATORIO.style.cssText = ''
        }, 1000)
    }
}
OPCIONES_SELECCIONAR.onclick = ({ target }) => {
    CATEGORIA_EVENTO.value = target.value
    OPCIONES_SELECCIONAR.style.pointerEvents = 'none'
    setTimeout(() => {
        OPCIONES_SELECCIONAR.style.pointerEvents = 'all'
    }, 100)
}
FORM_CREAR_NOTA.onsubmit = e => {
    e.preventDefault()

    let tituloNota = document.querySelector('#tituloNota').value
    let descripcionNota = document.querySelector('#descripcionNota').value

    descripcionNota = validarExpresiones(descripcionNota)

    if (tituloNota.trim() == '' && descripcionNota.trim() == '') {
        notificacion('La nota debe tener título o descripción')
    } else {
        let nuevoId = 'N-' + generarId()
        let datosNota = [tituloNota, descripcionNota, nuevoId]
        crearNota(datosNota)
        FORM_CREAR_NOTA.reset()

        let ordenNotas = localStorage.getItem('ordenNotas');
        ordenNotas = ordenNotas ? ordenNotas.split('|') : []
        ordenNotas.unshift(nuevoId)
        localStorage.setItem('ordenNotas', ordenNotas.join('|'));

        BTN_SECCION_NOTAS.onclick()
        window.location.href = '#notas'
    }
}
FORM_CREAR_EVENTO.onsubmit = e => {
    e.preventDefault()

    let tituloEvento = document.querySelector('#tituloEvento').value
    let descripcionEvento = document.querySelector('#descripcionEvento').value
    let fechaEvento = document.querySelector('#fechaEvento').value
    let horaInicio = document.querySelector('#horaInicio').value
    let horaFin = document.querySelector('#horaFin').value

    descripcionEvento = validarExpresiones(descripcionEvento)

    let categoriaEvento = JSON.parse(localStorage.getItem('categorias')) || []

    for (let e of categoriaEvento) {
        if (e.nombre == CATEGORIA_EVENTO.value) {
            categoriaEvento = e
            break
        } else {
            categoriaEvento = {
                nombre: 'Ninguna',
                color: '',
                id: ''
            }
        }
    }

    if (fechaEvento == '' || horaInicio == '' || horaFin == '') {
        notificacion('El evento debe tener fecha y hora de cuando será')
    } else {
        let fechaActualizar = fechaEvento.split('-')
        fechaActualActualizar(parseInt(fechaActualizar[0]), parseInt((fechaActualizar[1] - 1)), parseInt(fechaActualizar[2]))

        if (tituloEvento == '') {
            tituloEvento = '(Sin título)'
        }
        let nuevoId = 'E-' + generarId()

        let datosEvento = [tituloEvento, descripcionEvento, fechaEvento, horaInicio, horaFin, categoriaEvento, recordatorio, nuevoId]
        crearEvento(datosEvento)
        FORM_CREAR_EVENTO.reset()
        recordatorio = 'visible'
        RECORDATORIO.onclick()
        BTN_SECCION_EVENTOS.onclick()
        window.location.href = '#eventos'
    }

}
BTN_SECCION_EVENTOS.onclick = () => {
    accionBtnEvento()
}
BTN_SECCION_NOTAS.onclick = () => {
    accionBtnNota()
}
BTN_CALENDARIO_ICON.onclick = () => {
    SECCION_CALENDARIO.className = SECCION_CALENDARIO.className === 'calendarioVisible' ? 'calendarioOculto' : 'calendarioVisible'
}
BTN_SECCION_EVENTOS2.onclick = () => {
    accionBtnEvento()
}
BTN_SECCION_NOTAS2.onclick = () => {
    accionBtnNota()
}

function accionBtnEvento() {
    BTN_SECCION_EVENTOS.className = 'seccionActual'
    BTN_SECCION_EVENTOS2.className = 'seccionActual'
    BTN_SECCION_NOTAS.className = ''
    BTN_SECCION_NOTAS2.className = ''
    SECCION_NOTAS.style.display = 'none'
    SECCION_EVENTOS.style.display = 'block'
    SECCION_CALENDARIO.className = 'calendarioVisible'

    mostrarEventos()
    actualizarCalendario(numeroMes, anio)
}
function accionBtnNota() {

    BTN_SECCION_NOTAS.className = 'seccionActual'
    BTN_SECCION_NOTAS2.className = 'seccionActual'
    BTN_SECCION_EVENTOS.className = ''
    BTN_SECCION_EVENTOS2.className = ''
    SECCION_NOTAS.style.display = 'block'
    SECCION_EVENTOS.style.display = 'none'
    SECCION_CALENDARIO.className = 'calendarioOculto'
    BTN_CALENDARIO_ICON.style.display = 'none'

    mostrarNotas()
}

function crearNota(datosNota) {
    class Notas {
        constructor(datos) {
            this.titulo = datos[0]
            this.descripcion = datos[1]
            this.id = datos[2]
        }
    }
    const nota = new Notas(datosNota)
    guardar(['nota', [nota]])
    notificacion('¡Nota creada con éxito!')
}
function crearEvento(datosEvento) {
    class Eventos {
        constructor(datos) {
            this.titulo = datos[0]
            this.descripcion = datos[1]
            this.fecha = datos[2]
            this.horaInicio = datos[3]
            this.horaFin = datos[4]
            this.categoria = datos[5]
            this.recordatorio = datos[6]
            this.id = datos[7]
        }
    }
    const evento = new Eventos(datosEvento)
    guardar(['evento', [evento]])
    notificacion('¡Evento creado con éxito!')
}
function guardar(datosGuardar) {
    let notaEventoJson = JSON.stringify(datosGuardar[1])

    if (localStorage.getItem(datosGuardar[0]) != null) {

        let notaEventosGuardados = JSON.parse(localStorage.getItem(datosGuardar[0]))

        notaEventosGuardados.forEach(e => {
            datosGuardar[1].push(e)
        })
        notaEventoJson = JSON.stringify(datosGuardar[1])

        localStorage.setItem(datosGuardar[0], notaEventoJson)
    } else {
        localStorage.setItem(datosGuardar[0], notaEventoJson)
    }
}
function mostrarNotas() {
    // window.location.host === "127.0.0.1:5500" ? 
    window.location = '/#notas' 
    // : 
    // window.location = 'https://agustinconcollato.github.io/EventNote/#notas'


    notas = JSON.parse(localStorage.getItem('nota')) || []
    CONTENEDOR_NOTAS.innerHTML = ''

    if (notas.length == 0) {
        CONTENEDOR_NOTAS.remove()

        NADA_CREADO.innerHTML = `
        <h4>No hay <span>notas</span> creadas</h4>
        <p>Puedes crear una con el boton <span class="spanCrear">CREAR <i class="fas fa-plus"></i></span></p>
        `
        SECCION_NOTAS.append(NADA_CREADO)
    } else {
        NADA_CREADO.remove()

        let ordenNotas = localStorage.getItem('ordenNotas');
        ordenNotas = ordenNotas ? ordenNotas.split('|') : [];
        ordenNotas.forEach(e => {
            notas.forEach(j => {
                if (j.id == e) {
                    CONTENEDOR_NOTAS.innerHTML += `
                    <div class="nota" id="${j.id}" data-id="${j.id}">
                        <h2>${j.titulo}</h2>
                        <p>${j.descripcion}</p>
                        <div class="eliminar contenedorSpanAviso">
                            <span class="spanAviso">Eliminar</span>
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    `
                }
            })
        })
        SECCION_NOTAS.append(CONTENEDOR_NOTAS)
        const ELIMINAR = document.querySelectorAll('.eliminar')
        ELIMINAR.forEach(e => {
            eliminar(e)
        })
        detalleNotas()
    }
}
function mostrarEventos() {
    if (window.innerWidth <= 1024) {
        SECCION_CALENDARIO.className = 'calendarioOculto'
        BTN_CALENDARIO_ICON.style.display = 'flex'
    } else {
        SECCION_CALENDARIO.className = 'calendarioVisible'
        BTN_CALENDARIO_ICON.style.display = 'none'
    }

    eventos = JSON.parse(localStorage.getItem('evento')) || []
    CONTENEDOR_EVENTOS.innerHTML = ''

    NADA_CREADO.innerHTML = `
        <h4>No hay <span>eventos</span> creados para esta fecha</h4>
        <p>Puedes crear uno con el boton <span class="spanCrear">CREAR <i class="fas fa-plus"></i></span></p>
    `
    CONTENEDOR_EVENTOS.append(NADA_CREADO)
    eventos.forEach(e => {
        if (fechaMostrarEvento == e.fecha) {
            NADA_CREADO.remove()
            CONTENEDOR_EVENTOS.innerHTML += `
            <div class="evento" id="${e.id}">
                <h2>${e.titulo}</h2>
                <p>${e.descripcion}</p>
                <span class="indicadorTipoEvento" style="background:${e.categoria?.color};">${e.categoria?.nombre}</span>
                <span class="horaEvento">${e.horaInicio} - ${e.horaFin}<i class="far fa-bell" style="visibility:${e.recordatorio};"></i></span>
                <div class="eliminar contenedorSpanAviso">
                    <span class="spanAviso">Eliminar</span>
                    <i class="fas fa-times"></i>
                </div>
            </div>
            `
        }
    })
    SECCION_EVENTOS.append(CONTENEDOR_EVENTOS)
    const ELIMINAR = document.querySelectorAll('.eliminar')
    ELIMINAR.forEach(e => {
        eliminar(e)
    })
    detalleEventos()
}
function notificacion(notificar) {
    const NOTIFICACION = document.querySelector('#notificacion')
    let span = document.createElement('span')
    span.innerText = notificar
    NOTIFICACION.append(span)

    setTimeout(() => {
        span.remove()
    }, 2500)
}
function eliminar(eliminar) {
    eliminar.onclick = () => {
        let guardados = ''
        let identificador = eliminar.parentNode.id
        identificador.charAt(0) == 'E' ? guardados = 'evento' : guardados = 'nota'

        let eventoNota = JSON.parse(localStorage.getItem(guardados))
        if (eventoNota != null) {
            for (let i = 0; i < eventoNota.length; i++) {
                if (identificador == eventoNota[i].id) {
                    let tituloAEliminar = eventoNota[i].titulo || '(Sin título)'
                    eventoNota.splice(i, 1)
                    localStorage.setItem(guardados, JSON.stringify(eventoNota))
                    guardados == 'evento' ? notificacion(`Evento "${tituloAEliminar}" eliminado`) : notificacion(`Nota "${tituloAEliminar}" eliminada`)
                    guardados == 'evento' ? mostrarEventos() : mostrarNotas()
                }
            }
        }
    }
}
function validarExpresiones(descripcion) {
    descripcion = descripcion.replace(/\n/g, " <br> ")

    let arrayDescripcion = descripcion.split(/\s+/g)
    let expresion = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    descripcion = ''
    arrayDescripcion.forEach(e => { descripcion += e.replace(expresion, '<a rel="nofollow" target="_blank" href="mailto:' + e + '"> ' + e + ' </a>') + ' ' });
    return descripcion
}
