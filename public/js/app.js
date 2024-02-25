// import Trix from "trix"

// document.addEventListener("trix-before-initialize", () => {
//   // Change Trix.config if you need
// })

const skillsSet = new Set()

document.addEventListener('DOMContentLoaded', iniciar)

function iniciar() {

    const skills = document.querySelector('.lista-conocimientos')

    if(skills) {

        skills.addEventListener('click', agregarSkills)

        // Una vez que estamos en editar, llamar la función (para que se añadan los skills automaticamente al value hidden)
        skillsSeleccionados()
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