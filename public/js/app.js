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

    const skillsArray = [...skillsSet]

    document.querySelector('#skills').value = skillsArray
}