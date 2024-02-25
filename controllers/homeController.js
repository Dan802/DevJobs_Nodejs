import mongoose from "mongoose"

const Vacante = mongoose.model('Vacante')

async function mostrarTrabajos(req, res, next) {
    
    // .lean(): vanilla JavaScript objects instead a full Mongoose document
    const vacantes = await Vacante.find().lean()

    if(!vacantes) return next()

    res.render('home', {
        page : 'devJobs',
        tagline: 'Find and Post Jobs for Web Developers',
        barra: true,
        boton: true,
        vacantes
    })
}

export default {
    mostrarTrabajos
}