import mongoose from "mongoose"

const Vacante = mongoose.model('Vacante')

function formularioNuevaVacante(req, res) {

    res.render('nueva-vacante', {
        page: 'Nueva Vacantes',
        tagLine: 'LLena el formulario y publica tu vacante'
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
    res.redirect(`/vacantes/${nuevaVacante.url}`)
}

export default {
    formularioNuevaVacante,
    agregarVacante
}