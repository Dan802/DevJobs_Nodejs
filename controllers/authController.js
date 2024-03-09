import passport from 'passport';
import Vacantes from '../models/Vacantes.js'
import Usuarios from '../models/Usuarios.js'
import crypto from 'crypto';
import { enviarEmail } from '../handlebars/email.js';
import email from '../config/email.js';

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
        nombre: req.user.userName,
        imagen : req.user.imagen

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

function formReestablecerPassword(req, res) {
    res.render('reestablecer-password', {
        page: 'Reset your password',
        tagline: 'If you already have an account but forgot your password, enter your email'
    })
}

/** General el token en la tabla del usuario
 * @param {*} req 
 * @param {*} res 
 */
async function enviarToken(req, res) {
    const usuario = await Usuarios.findOne({email: req.body.email})

    if(!usuario) {
        req.flash('error', 'This account does not exist')
        return res.redirect('/login')
    }

    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expira = Date.now() + 360000

    await usuario.save()
    const resetUrl = `http://${req.headers.host}/reset-password/${usuario.token}`

    // Enviar notificaion por email
    await enviarEmail({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto', 'Check your email for instructions.')
    res.redirect('/login')
}

// Valida si el token es valido y el usuario existe
async function reestablecerPassword(req, res) {
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    })

    if(!usuario) {
        req.flash('error', 'The token is not valid, try again')
        return res.redirect('/reset-password')
    }

    //TODO 
    res.render('nuevo-password', {
        page: 'New Password'
    })
}

// Almacena el nuevo password en la BD
async function guardarPassword(req, res) {

    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    })

    if(!usuario) {
        req.flash('error', 'The token is not valid, try again')
        return res.redirect('/reset-password')
    }

    // Limpiar valores previos
    usuario.password = req.body.password
    usuario.token = undefined;
    usuario.expira = undefined;
    
    // Guardar en la base de datos
    await usuario.save()

    req.flash('correcto', 'The password have been saved successfully')
    res.redirect('/login')
}

export default {
    autenticarUsuario,
    verificarUsuario,
    mostrarPanel,
    cerrarSesion,
    formReestablecerPassword,
    enviarToken,
    reestablecerPassword,
    guardarPassword
}