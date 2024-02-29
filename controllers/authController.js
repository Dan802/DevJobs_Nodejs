import passport from 'passport';
import Vacantes from '../models/Vacantes.js'

const autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/admin',
    failureRedirect : '/login',
    failureFlash: true,
    badRequestMessage : 'Both fields are required'
})

// Revisar si el usuario esta autenticado
function verificarUsuario(req, res, next) {

    // metodo de passport
    if(req.isAuthenticated()) {
        return next() // estan autenticados
    }

    res.redirect('/login')
}

async function mostrarPanel(req, res) {

    // Consultar el usuario autenticado
    const vacantes = await Vacantes.find({autor : req.user._id}).lean()

    res.render('administracion', {
        page: 'Administration Panel',
        tagline: 'Create and manage your vacancies from here',
        vacantes,
        cerrarSesion: true,
        nombre: req.user.userName
    })
}

function cerrarSesion(req, res) {

    req.logout(function(err){
        if(err) {
            req.flash('error', err)
        } else {
            req.flash('correcto', 'You have successfully logged out')
        }
        return res.redirect('/login')
    });
}

export default {
    autenticarUsuario,
    verificarUsuario,
    mostrarPanel,
    cerrarSesion
}