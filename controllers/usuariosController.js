// Importar modelo de la base de datos
    import Usuarios from "../models/Usuarios.js"
// O también:
    // import mongoose from "mongoose"
    // const Usuarios = mongoose.model('Usuarios')

import { body, validationResult } from 'express-validator'


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
        body('userName').notEmpty().withMessage('El nombre es obligatorio'),
        body('email').notEmpty().withMessage('El email es obligatorio'),
        body('password').notEmpty().withMessage('El password es obligatorio'),
        body('confirm').notEmpty().withMessage('Confirmar password es obligatorio'),

        body('email').isEmail().withMessage('Ingrese un email valido'),
        body('email').normalizeEmail(),
        body('confirm').equals(req.body.password).withMessage('Los passwords no son iguales')
    ];

    await Promise.all(rules.map(validation => validation.run(req)));

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
        res.render('crear-cuenta', {
            page: 'Create an account on DevJobs',
            tagline: 'Start recruiting new talents for free, just create an account',
            mensajes: req.flash()
        })
    } else {
        next() // next to crearUsuario
    }
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

export default {
    formCrearCuenta,
    validarRegistro,
    crearUsuaurio,
    formIniciarSesion
}