import passport from 'passport';

const autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/admin',
    failureRedirect : '/login',
    failureFlash: true,
    badRequestMessage : 'Both fields are required'
})

export default {
    autenticarUsuario
}