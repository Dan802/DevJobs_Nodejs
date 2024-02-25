import mongoose from "mongoose"

const Vacante = mongoose.model('Vacante')

function formularioNuevaVacante(req, res) {

    res.render('nueva-vacante', {
        page: 'New Position',
        tagLine: 'Fill out the form and publish your job opening'
    })
}

// Guardar una nueva vacante en la base de datos
async function agregarVacante(req, res) {

    const vacante = new Vacante(req.body)

    // crear arreglo de habilidades (skills)
    vacante.skills = req.body.skills.split(',')

    // Almacenarlo en la base de datos
    const nuevaVacante = await vacante.save()

    // redireccionar
    res.redirect(`/vacancies/${nuevaVacante.url}`)
}

// Muestra una vacante
async function mostrarVacante(req, res, next) {

    // const vacante = await Vacante.findOne({url: req.params.url }).exec()
    const vacante = await Vacante.findOne({url: req.params.url}).lean()

    if(!vacante) return next()

    res.render('vacante', {
        vacante,
        page: vacante.title,
        barra: true
    })
}

// Editar una vacante
async function formEditarVacante(req, res, next) {

    const vacante = await Vacante.findOne({url: req.params.url}).lean()

    if(!vacante) return next()

    res.render('editar-vacante', {
        vacante, 
        page: `Edit - ${vacante.title}`
    })

}

async function editarVacante(req, res) {

    const vacanteActualizada = req.body

    // crear arreglo de habilidades (skills)
    vacanteActualizada.skills = req.body.skills.split(',')

    // new:true devolver la nueva vacante guardada
    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteActualizada, {new: true, runValidators: true})

    res.redirect(`/vacancies/${vacante.url}`)
}

export default {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
}