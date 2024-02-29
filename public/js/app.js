import axios from "axios"
import Swal from "sweetalert2"
// import Trix from "trix"

// document.addEventListener("trix-before-initialize", () => {
//   // Change Trix.config if you need
// })

const skillsSet = new Set()

document.addEventListener('DOMContentLoaded', iniciar)

function iniciar() {

    const skills = document.querySelector('.lista-conocimientos')
    const alertas = document.querySelector('.alertas')
    const vacantesListado = document.querySelector('.panel-administracion')

    if(skills) {

        skills.addEventListener('click', agregarSkills)

        // Una vez que estamos en editar, llamar la función (para que se añadan los skills automaticamente al value hidden)
        skillsSeleccionados()
    }

    if(alertas){
        // Limpiar/desaparecer las alertas
        limpiarAlertas()
    }

    if(vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado)
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

// Elimina Vacantes
function accionesListado(e) {

    if(e.target.dataset.eliminar) {
        e.preventDefault()

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel"
        }).then((result) => {
            if (result.isConfirmed) {

                // Enivar petición por medio de axios
                const url = `${location.origin}/vacancies/delete/${e.target.dataset.eliminar}`

                // Axios para eliminar el registro
                // axios.delete(url , Axios options)
                // https://masteringjs.io/tutorials/axios/options

                // params: POJO or URLSearchParams that Axios will use as the query string, in this case, URLSearchParams = ${e.target.dataset.eliminar}
                // Equivalent to `axios.delete('https://http://localhost:3000/admin/65dec62084a5b27292da6ebf')`
                axios.delete(url, {params: {url}})
                    .then(function(respuesta) {

                        // La respuesta la mandamos desde vacantesController.js
                        
                        if(respuesta.status === 200) {
                            
                            Swal.fire({
                                title: "Deleted!",
                                text: respuesta.data,
                                icon: "success"
                            }).then(() => {
                                
                                // Eliminar del DOM
                                e.target.parentElement.parentElement.remove()
    
                                window.location = `${location.origin}/admin`;
                            })
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'There was an error',
                            text: "The position couldn't be deleted",
                            icon: "error"
                        })
                    })
            }
        });
    }
}