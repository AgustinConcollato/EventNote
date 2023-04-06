
const DESCRIPCION_NOTA_EDITAR = document.querySelector('#descripcionNotaEditar')
const TITULO_NOTA_EDITAR = document.querySelector('#tituloNotaEditar')

TITULO_NOTA_EDITAR.onkeyup = () =>{
    editarNota()
}
DESCRIPCION_NOTA_EDITAR.onkeyup = () =>{
    editarNota()
}

function detalleNotas(){
    const NOTAS = document.querySelectorAll('.nota')

    NOTAS.forEach(e => {
        e.onclick = ({target}) =>{
            let notas = JSON.parse(localStorage.getItem('nota'))
            sessionStorage.setItem('nota', target.id)

            let resultado = notas.find(({id}) => id == target.id)
            if(target.className == 'nota'){
                window.location.href = "#detalleNota"
                TITULO_NOTA_EDITAR.value = resultado.titulo
                DESCRIPCION_NOTA_EDITAR.innerHTML = resultado.descripcion
            }
        }
    })
}
function editarNota(){
    let idNotaEditar = sessionStorage.getItem('nota')
    let notasGuardadas = JSON.parse(localStorage.getItem('nota')) 
    for(let i = 0; i < notasGuardadas.length; i++){
        if(notasGuardadas[i].id == idNotaEditar){
            notasGuardadas.splice(i,1,{
                titulo: TITULO_NOTA_EDITAR.value,
                descripcion: validarExpresiones(DESCRIPCION_NOTA_EDITAR.innerText),
                id: idNotaEditar
            })
            let notasEditadas = JSON.stringify(notasGuardadas)
            localStorage.setItem('nota', notasEditadas)
            mostrarNotas()
        }
    }
}