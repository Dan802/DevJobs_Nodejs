import passport from 'passport'
// import LocalStrategy  from 'passport-local'
import {Strategy as LocalStrategy}  from 'passport-local'
import Usuarios from '../models/Usuarios.js'

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
    const usuario = await Usuarios.findOne({ email })

    if(!usuario) return done(null, false, {
        message : "Username does not exist"
    })

    const verificarPass = usuario.compararPassword(password)

    if(!verificarPass) return done(null, false, {
        message: "The password is not correct"
    })

    // El usuario existe y el password es correcto
    return done(null, usuario)
}))

passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})

passport.deserializeUser(async (id, done) => {
    
    const usuario = await Usuarios.findById(id).exec()

    return done(null, usuario)
})

export default {
    passport
}