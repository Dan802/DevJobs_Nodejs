// Importar modelo de la base de datos
    import Usuarios from "../models/Usuarios.js"
// O también:
    // import mongoose from "mongoose"
    // const Usuarios = mongoose.model('Usuarios')

import { body, validationResult } from 'express-validator'
import passport from 'passport';


function formCrearCuenta (req, res) {

    res.render('crear-cuenta', {
        page: 'Create an account on DevJobs',
        tagline: 'Start recruiting new talents for free, just create an account'
    })
}

//#region Así también se podría validar los inputs con express-validator

function validateUserName (req, res, next) {
    body('userName').trim().notEmpty().withMessage('The name is required')(req, res, next)
};

function handleValidationResult  (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
};
//#endregion

async function validarRegistro(req, res, next) {

    const rules = [
        //Sanitizamos los datos
        body('userName').escape(),
        body('email').escape(),
        body('password').escape(),
        body('confirm').escape(),

        // Verificamos que no esten vacios
        body('userName').notEmpty().withMessage('The name is required'),
        body('email').notEmpty().withMessage('The email is required'),
        body('password').notEmpty().withMessage('The password is required'),
        body('confirm').notEmpty().withMessage('Confirmar password es obligatorio'),

        body('email').isEmail().withMessage('Enter a valid email'),
        body('email').normalizeEmail(),
        body('confirm').equals(req.body.password).withMessage('Los passwords no son iguales')
    ];

    // Añadimos los errores al req
    await Promise.all(rules.map(validation => validation.run(req)));

    // Y luego los validamos
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        // errores = {
        //     formatter :  [Function: formatter] , 
        //     errors: [{
        //         type, 
        //         value, 
        //         msg, 
        //         path, 
        //         location
        //     }]
        // }
                
        // errores.array() = [{
        //     type, 
        //     value, 
        //     msg, 
        //     path, 
        //     location 
        // }]

        const errorMessages =  errores.array().map(error => error.msg)
        // errorMessages = [
        //     error.msg,
        //     error.msg...
        // ]
               
        //Añadimos los errores al req.flash
        req.flash('error', errorMessages)
        
        // Mandamos a la misma página y visualizamos los errores con un helper
        return res.render('crear-cuenta', {
            page: 'Create an account on DevJobs',
            tagline: 'Start recruiting new talents for free, just create an account',
            mensajes: req.flash()
        })
    } 

    next() // next to crearUsuario
}

async function crearUsuaurio (req, res) {
    
    //Una vez pasamos todas las validaciones del registro...

    const usuario = new Usuarios(req.body)

    try {
        await usuario.save()
        res.redirect('/login')

    } catch (error) {
        // intentamos guardar, pero arroja error
        // en Usuario.js tenemos una funcion post save pa que pasó
        // si el error es porque ya existía un usuario, recibimos un error personalizado
        // si es otra cosa error default

        // Añadimos los errores al req.flash
        req.flash('error', error)

        // Redirigimos a la misma página (ruta GET) para empezar de nuevo
        // El mensaje de error se muestra porque hay un middelware que se ejecuta siempre en cada pagina
        res.redirect('/create-account')
    }
}

function formIniciarSesion(req, res) {

    res.render('iniciar-sesion', {
        page: 'Login Devjobs'
    })
}

// form editar el perfil
function formEditarPerfil(req, res) {

    res.render('editar-perfil', {
        page: 'Edit your profile in DevJobs',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.userName
    })
}

// Guardar cambios editar perfil
async function editarPerfil(req, res) {

    const usuario = await Usuarios.findById(req.user._id)

    // Verificar la contraseña
    const verificarPass = usuario.compararPassword(req.body.password)

    if(!verificarPass) {
        req.flash('error', 'The password is incorrect')
        return res.redirect('/edit-profile')
    }

    // Verificar que el correo no pertenezca a otro usuario
    if(usuario.email != req.body.email) { // Si el correo es diferente entonces...

        const usuario = await Usuarios.findOne({ email: req.body.email })

        if(usuario) {
            req.flash('error', 'There is already a user with this email')
            return res.redirect('/edit-profile')
        }
    }

    // Modificamos a usuario con los valores del req.body
    usuario.userName = req.body.userName 
    usuario.email = req.body.email 

    await usuario.save();
    req.flash('correcto', 'The changes were made correctly')
    res.redirect('/admin')
}

// Sanitizar y validar el formulario de editar perfiles
async function validaPerfil(req, res, next) {

    const rules = [
        //Sanitizamos los datos
        body('userName').escape(),
        body('email').escape(),
        body('password').escape(),

        // Verificamos que no esten vacios
        body('userName').notEmpty().withMessage('The name is required'),
        body('email').notEmpty().withMessage('The email is required'),
        body('password').notEmpty().withMessage('The password is required'),

        body('email').isEmail().withMessage('Enter a valid email'),
        body('email').normalizeEmail(),
    ];

    // Añadimos los errores al req
    await Promise.all(rules.map(validation => validation.run(req)));

    // Y luego los validamos
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        
        const errorMessages =  errores.array().map(error => error.msg)
               
        //Añadimos los errores al req.flash
        req.flash('error', errorMessages)
        
        // Mandamos a la misma página y visualizamos los errores con un helper
        return res.render('editar-perfil', {
            page: 'Edit your profile in DevJobs',
            usuario: req.user.toObject(),
            cerrarSesion: true,
            nombre: req.user.userName,
            mensajes: req.flash()
        })
    } 

    next() // next to crearUsuario
}

export default {
    formCrearCuenta,
    validarRegistro,
    crearUsuaurio,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
    validaPerfil
}