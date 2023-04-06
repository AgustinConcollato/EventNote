
const ROOT = document.querySelector(':root')
const CONTENEDOR_TEMAS = document.querySelector('#contenedorBtnTemas')
const TEMAS = [
    {
        textColor:'#eee',
        firstBackgroundColor:'#27282d',
        secondBackgroundColor:'#1F2023',
        borderColor:'#ffffff20',
        firstColor:'#5193fc',
        secondColor:'#4189e633',
        colorLogo:'#1872fa'
    },
    {
        textColor:'#575758',
        firstBackgroundColor:'#fff',
        secondBackgroundColor:'#f5f5f5',
        borderColor:'#eee',
        firstColor:'#5193fc',
        secondColor:'#4189e633',
        colorLogo:'#1872fa'
    },
    {
        textColor:'#575758',
        firstBackgroundColor:'#fff',
        secondBackgroundColor:'#f5f5f5',
        borderColor:'#eee',
        firstColor:'#d66140',
        secondColor:'#d6614033',
        colorLogo:'#ab4d32'
    },
    {
        textColor:'#575758',
        firstBackgroundColor:'#fff',
        secondBackgroundColor:'#f5f5f5',
        borderColor:'#eee',
        firstColor:'#edbf48',
        secondColor:'#edbf4823',
        colorLogo:'#cfa741'
    }
]
let tema

inicializarTema()

CONTENEDOR_TEMAS.onmouseover = ({target}) => {
    cambiarTema(target.value)
}
CONTENEDOR_TEMAS.onmouseout = () => {
    cambiarTema(tema)
}
CONTENEDOR_TEMAS.onclick = ({target}) => {
    localStorage.setItem('tema',target.value)
    cambiarTema(target.value)
    inicializarTema()
    notificacion(`Tema cambiado a ${target.innerText}`)
}

function inicializarTema(){
    tema = localStorage.getItem('tema') || 1
    cambiarTema(tema)
}
function cambiarTema(e){
    ROOT.style.setProperty('--text-color', TEMAS[e].textColor)
    ROOT.style.setProperty('--first-background-color', TEMAS[e].firstBackgroundColor)
    ROOT.style.setProperty('--second-background-color', TEMAS[e].secondBackgroundColor)
    ROOT.style.setProperty('--border-color', TEMAS[e].borderColor)
    ROOT.style.setProperty('--first-color', TEMAS[e].firstColor)
    ROOT.style.setProperty('--second-color', TEMAS[e].secondColor)
    ROOT.style.setProperty('--color-logo', TEMAS[e].colorLogo)
}
