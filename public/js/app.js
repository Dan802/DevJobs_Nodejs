// import Trix from "trix"

// document.addEventListener("trix-before-initialize", () => {
//   // Change Trix.config if you need
// })

const skillsSet = new Set()

document.addEventListener('DOMContentLoaded', iniciar)

function iniciar() {

    const skills = document.querySelector('.lista-conocimientos')
    const alertas = document.querySelector('.alertas')

    if(skills) {

        skills.addEventListener('click', agregarSkills)

        // Una vez que estamos en editar, llamar la función (para que se añadan los skills automaticamente al value hidden)
        skillsSeleccionados()
    }

    if(alertas){
        // Limpiar/desaparecer las alertas
        limpiarAlertas()
    }
}

function agregarSkills(e) {
    
    if(e.target.tagName === 'LI'){

        if(e.target.classList.contains('activo')) {

            skillsSet.delete(e.target.textContent)
            e.target.classList.remove('activo')
        } else {
            skillsSet.add(e.target.textContent)
            e.target.classList.add('activo')
        }
    } 

    // Set to Array
    const skillsArray = [...skillsSet]

    document.querySelector('#skills').value = skillsArray
}

function skillsSeleccionados() {

    const seleccionadas = document.querySelectorAll('.lista-conocimientos .activo')
    const seleccionadasArray = Array.from(seleccionadas)

    // extraer el valor del <LI>
    seleccionadasArray.forEach(seleccionada => {
        skillsSet.add(seleccionada.textContent)
    })
    
    // Set to Array
    const skillsArray = [...skillsSet]
    
    // inyectarlo al input:hidden
    document.querySelector('#skills').value = skillsArray
}

function limpiarAlertas() {

    // div padre de alertas
    const alertas = document.querySelector('.alertas')

    // setInterval = while pero cada loop con tiempo definido
    const interval = setInterval(() => {

        // Div de cada alerta singular
        const alertaDiv = document.querySelectorAll('.alertas .alerta')
        
        if(alertas.children.length > 0) {

            // Lo desaparecemos con CSS
            alertaDiv[0].classList.toggle('invisible') //toma 1s

            // Lo eliminamos del HTML
            setTimeout(() => {
                alertas.removeChild(alertas.children[0]);
            }, 1010);

        } else if(alertas.children.length === 0) {

            alertas.parentElement.removeChild(alertas)
            clearInterval(interval) // Salimos del loop

        }
    }, 2000);
}