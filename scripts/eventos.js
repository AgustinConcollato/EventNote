
const NUEVA_CATEGORIA = document.querySelector('#nuevaCategoria')
const FORM_NUEVA_CATEGORIA = document.querySelector('#formNuevaCategoria')
const CERRAR_FORM_NUEVA_CATEGORIA = document.querySelector('#cerrarNuevaCategoria')
const NOMBRE_CATEGORIA = document.querySelector('#nombreCategoria')
const BTN_COLORES = document.querySelectorAll('#coloresPorDefecto button')
const COLOR_PERSONALIZADO = document.querySelector('#colorPersonalizado')
const COLOR_ELEGIDO = document.querySelector('#colorElegido')
const CARACTERES = document.querySelector('#cantidadCaracteres')

const OPCIONES_CATEGORIAS = document.querySelector('#opcionesCategorias')
const CATEGORIAS_LATERALES = document.querySelector('#contenedorCategoriasLaterales')

const CONTENEDOR_FECHA = document.querySelector('#contenedorFecha')
const MOSTRAR_FECHA_ACTUAL = document.querySelector('#fecha')
const FECHA_ACTUAL = new Date()

const TITULO_EVENTO_EDITAR = document.querySelector('#tituloEventoEditar')
const DESCRIPCION_EVENTO_EDITAR = document.querySelector('#descripcionEventoEditar')
const CATEGORIA_EVENTO_EDITAR = document.querySelector('#categoriaEventoEditar')
const FECHA_EVENTO_EDITAR = document.querySelector('#fechaEventoEditar')
const HORA_INICIO_EVENTO_EDITAR = document.querySelector('#horaInicioEditar')
const HORA_FIN_EVENTO_EDITAR = document.querySelector('#horaFinEditar')
const RECORDATORIO_EVENTO_EDITAR = document.querySelector('#recordatorioEventoEditar')
const OPCIONES_CATEGORIAS_EDITAR = document.querySelector('#opcionesCategoriasEditar')

let categoriaEvento
let nombreCategoriaDetalle = ''
let recordatorioEditar

let fechaMostrarEvento = ''
let anioMostrarEvento = FECHA_ACTUAL.getFullYear()
let mesMostrarEvento = FECHA_ACTUAL.getMonth()
let diaMostrarEvento = FECHA_ACTUAL.getDate()

fechaActualActualizar(anioMostrarEvento,mesMostrarEvento,diaMostrarEvento)
configurarCategorias()

NUEVA_CATEGORIA.onclick = () => {
    FORM_NUEVA_CATEGORIA.className = 'formNuevaCategoriaSeleccionado'
}
CERRAR_FORM_NUEVA_CATEGORIA.onclick = () => {
    FORM_NUEVA_CATEGORIA.className = ''
    FORM_NUEVA_CATEGORIA.reset()
    CARACTERES.style.opacity = '0'
}
FORM_NUEVA_CATEGORIA.onsubmit = e =>{
    e.preventDefault()

    if(NOMBRE_CATEGORIA.value.trim() == ''){
        notificacion('La categoría debe tener nombre')
    }else if(NOMBRE_CATEGORIA.value.trim().length > 12){
        notificacion('Máximo 12 caracteres por nombre')
    }else{
        let nombre = NOMBRE_CATEGORIA.value
        let color = COLOR_ELEGIDO.value
        let id = 'C-' + generarId()

        let datosCategoria = [nombre, color, id] 
        crearCategoria(datosCategoria)
        CERRAR_FORM_NUEVA_CATEGORIA.onclick()
        configurarCategorias()
    }

}
BTN_COLORES.forEach(btn =>{
    btn.onclick = ({target}) =>{
        COLOR_ELEGIDO.value = target.value
    }
})
COLOR_PERSONALIZADO.onchange = ({target}) => {
    COLOR_ELEGIDO.value = target.value
}
NOMBRE_CATEGORIA.onkeyup = () =>{
    CARACTERES.style.opacity = '.7'
    if(NOMBRE_CATEGORIA.value.length <= 12){
        CARACTERES.innerHTML = NOMBRE_CATEGORIA.value.length + '/12'
    }else{
        CARACTERES.innerHTML = '12/12'
    }
}
CONTENEDOR_FECHA.onclick = ({target}) => {
    if (target.id == 'fechaAnterior') {
        diaMostrarEvento--
        if(diaMostrarEvento < 1){
            diaMostrarEvento = new Date(anioMostrarEvento,mesMostrarEvento,0).getDate()
            mesMostrarEvento--
            if(mesMostrarEvento < 0){
                anioMostrarEvento--
                if (anioMostrarEvento < FECHA_CALENDARIO.getFullYear()) {
                    anioMostrarEvento = FECHA_CALENDARIO.getFullYear()
                    mesMostrarEvento = 0
                    diaMostrarEvento = 1
                }else{
                    mesMostrarEvento = 11
                }
            }
        }
        fechaActualActualizar(anioMostrarEvento,mesMostrarEvento,diaMostrarEvento)
    } else if (target.id == 'fechaSiguiente') {
        diaMostrarEvento++
        if(diaMostrarEvento > new Date(anioMostrarEvento,mesMostrarEvento + 1,0).getDate()){
            mesMostrarEvento++
            diaMostrarEvento = 1
            if(mesMostrarEvento > 11){
                anioMostrarEvento++
                mesMostrarEvento = 0
            }
        }
        fechaActualActualizar(anioMostrarEvento,mesMostrarEvento,diaMostrarEvento)
    }
    mostrarEventos()
}
TITULO_EVENTO_EDITAR.onkeyup = () =>{
    editarEvento()
}
DESCRIPCION_EVENTO_EDITAR.onkeyup = () =>{
    editarEvento()
}
OPCIONES_CATEGORIAS_EDITAR.onclick = ({target}) =>{
    CATEGORIA_EVENTO_EDITAR.value = target.value 
    OPCIONES_CATEGORIAS_EDITAR.style.pointerEvents = 'none'
    setTimeout(() =>{
        OPCIONES_CATEGORIAS_EDITAR.style.pointerEvents = 'all'
    },100)
    editarEvento()
}
FECHA_EVENTO_EDITAR.onchange = () =>{
    editarEvento()
}
HORA_INICIO_EVENTO_EDITAR.onchange = () =>{
    editarEvento()
}
HORA_FIN_EVENTO_EDITAR.onchange = () =>{
    editarEvento()
}
RECORDATORIO_EVENTO_EDITAR.onclick = () =>{
    if(recordatorioEditar == 'hidden'){
        recordatorioEditar = 'visible'
        RECORDATORIO_EVENTO_EDITAR.style.cssText = 'animation: recordatorio .8s 1;'
        setTimeout(()=> {
            RECORDATORIO_EVENTO_EDITAR.className = 'fas fa-bell'
            RECORDATORIO_EVENTO_EDITAR.style.cssText = ''
        },1000)

    }else{
        recordatorioEditar = 'hidden'
        RECORDATORIO_EVENTO_EDITAR.style.cssText = 'animation: recordatorio .8s 1;'
        setTimeout(()=> { 
            RECORDATORIO_EVENTO_EDITAR.className = 'far fa-bell'
            RECORDATORIO_EVENTO_EDITAR.style.cssText = ''
        },1000)
    }
    editarEvento()
}

function crearCategoria(datosCategoria){
    class Categorias {
        constructor(datos) {
            this.nombre = datos[0]
            this.color = datos[1]
            this.id = datos[2]
        }
    }
    const categoria = new Categorias(datosCategoria)
    guardar(['categorias',[categoria]])
    notificacion('¡Categoría creada con éxito!')
}
function configurarCategorias(){
    if(JSON.parse(localStorage.getItem('categorias')) == null){
        categoriaEvento = [
            {
                nombre: 'Trabajo',
                color: '#cd0101',
                id: 'C-' + generarId()
            },
            {
                nombre: 'Personal',
                color: '#7800e3',
                id: 'C-' + generarId()
            },
            {
                nombre: 'Cumpleaños',
                color: '#40c100',
                id: 'C-' + generarId()
            },
            {
                nombre: 'Estudios',
                color: '#1872fa',
                id: 'C-' + generarId()
            }
        ]
    }else{
        categoriaEvento = JSON.parse(localStorage.getItem('categorias'))
    }
    localStorage.setItem('categorias', JSON.stringify(categoriaEvento))
    mostrarCategorias()
}
function mostrarCategorias(){
    OPCIONES_CATEGORIAS.innerHTML = '<button type="button" value="Ninguna">Ninguna</button>'
    CATEGORIAS_LATERALES.innerHTML = ''

    if(categoriaEvento.length > 0){
        categoriaEvento.forEach(e => {
            CATEGORIAS_LATERALES.innerHTML += `
            <div class="categoriaLateral">
                <i class="fas fa-circle" style="color:${e.color};"></i>
                <h4>${e.nombre}</h4>
                <i class="fas fa-times eliminarCategoria" id="${e.id}"></i>
            </div>
            `
            OPCIONES_CATEGORIAS.innerHTML += `<button type="button" value="${e.nombre}"><i class="fas fa-circle" style="color:${e.color};"></i> ${e.nombre}</button>`

            if(e.nombre != nombreCategoriaDetalle){
                OPCIONES_CATEGORIAS_EDITAR.innerHTML += `<button type="button" value="${e.nombre}"><i class="fas fa-circle" style="color:${e.color};"></i> ${e.nombre}</button>`
            }
            const ELIMINAR = document.querySelectorAll('.eliminarCategoria')
            ELIMINAR.forEach(e => {
                eliminarCategoria(e)
            })
        })
    }else{
        CATEGORIAS_LATERALES.innerHTML = `
        <span>No hay categorías creadas</span>
        <button id="restablecer">Restablecer categorías predeterminadas</button>
        `
        document.querySelector('#restablecer').onclick = () =>{
            localStorage.removeItem('categorias')
            configurarCategorias()
        }
    }
}
function eliminarCategoria(eliminar){
    eliminar.onclick = () =>{
        let identificador = eliminar.id

        let categorias = JSON.parse(localStorage.getItem('categorias'))        
        if(categorias != null){
            for(let i = 0; i < categorias.length; i++){
                if(identificador == categorias[i].id){
                    let categoriaAEliminar = categorias[i].nombre || '(Sin título)'
                    categorias.splice(i,1)
                    localStorage.setItem('categorias',JSON.stringify(categorias))
                    notificacion(`Categoria "${categoriaAEliminar}" eliminada`) 
                    configurarCategorias()
                }
            }
        }
    }
}
function generarId(){
    return Math.random().toString(36).substr(2)  
}
function fechaActualActualizar(a,m,d){
    anioMostrarEvento = a
    mesMostrarEvento = m
    diaMostrarEvento = d
    m++
    if(d < 10){
        d = '0'+d
    }
    if(m < 10){
        m = '0'+m
    }
    fechaMostrarEvento = a +'-'+ m +'-'+ d
    MOSTRAR_FECHA_ACTUAL.innerText = `${d} ${new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(a, m-1))} ${a}`
}
function detalleEventos(){
    const EVENTO = document.querySelectorAll('.evento')

    EVENTO.forEach(e => {
        e.onclick = ({target}) =>{
            let eventos = JSON.parse(localStorage.getItem('evento'))
            sessionStorage.setItem('evento', target.id)

            resultadoEvento = eventos.find(({id}) => id == target.id)
            if(target.className == 'evento'){
                window.location.href = "#detalleEvento"
                resultadoEvento.titulo == '(Sin título)' ? TITULO_EVENTO_EDITAR.value = '' : TITULO_EVENTO_EDITAR.value = resultadoEvento.titulo
                DESCRIPCION_EVENTO_EDITAR.innerHTML = resultadoEvento.descripcion
                CATEGORIA_EVENTO_EDITAR.value = resultadoEvento.categoria.nombre
                FECHA_EVENTO_EDITAR.value = resultadoEvento.fecha
                HORA_INICIO_EVENTO_EDITAR.value = resultadoEvento.horaInicio
                HORA_FIN_EVENTO_EDITAR.value = resultadoEvento.horaFin
                resultadoEvento.recordatorio == 'hidden' ? RECORDATORIO_EVENTO_EDITAR.className = 'far fa-bell' : RECORDATORIO_EVENTO_EDITAR.className = 'fas fa-bell' 
            }
            recordatorioEditar = resultadoEvento.recordatorio
            nombreCategoriaDetalle = resultadoEvento.categoria?.nombre
            OPCIONES_CATEGORIAS_EDITAR.innerHTML = '<button type="button" value="Ninguna">Ninguna</button>'
            configurarCategorias()
        }
    })
}
function editarEvento(){
    let idEventoEditar = sessionStorage.getItem('evento')
    let eventosGuardados = JSON.parse(localStorage.getItem('evento')) 
    let categoriaEvento = JSON.parse(localStorage.getItem('categorias')) || []

    for(let e of categoriaEvento){
        if(e.nombre == CATEGORIA_EVENTO_EDITAR.value){
            categoriaEvento = e
            nombreCategoriaDetalle = e.nombre
            break
        } else{
            categoriaEvento = {
                nombre: 'Ninguna',
                color: '',
                id: ''
            }
        }
    }
    OPCIONES_CATEGORIAS_EDITAR.innerHTML = '<button type="button" value="Ninguna">Ninguna</button>'
    configurarCategorias()
    
    for(let i = 0; i < eventosGuardados.length; i++){
        if(eventosGuardados[i].id == idEventoEditar){
            eventosGuardados.splice(i,1,{
                titulo: TITULO_EVENTO_EDITAR.value || '(Sin título)',
                descripcion: validarExpresiones(DESCRIPCION_EVENTO_EDITAR.innerText),
                fecha: FECHA_EVENTO_EDITAR.value,
                horaInicio: HORA_INICIO_EVENTO_EDITAR.value,
                horaFin: HORA_FIN_EVENTO_EDITAR.value,
                categoria: categoriaEvento,
                recordatorio: recordatorioEditar,
                id: idEventoEditar
            })
            let eventosEditados = JSON.stringify(eventosGuardados)
            localStorage.setItem('evento', eventosEditados)
            mostrarEventos()
        }
    }
}