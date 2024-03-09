import multer from 'multer'
import { body, validationResult } from 'express-validator'
import shortid from 'shortid'
import { UUID } from "mongodb"; // Para ids mas únicos
import { fileURLToPath } from 'url'

// Importar modelo de la base de datos
import Usuarios from "../models/Usuarios.js"
// import mongoose from "mongoose"
// const Usuarios = mongoose.model('Usuarios')

// Subir imagen con multer
function subirImagen(req, res, next) {

    const filePath = fileURLToPath(new URL('../public/uploads/perfiles', import.meta.url)) // root\public\uploads\perfiles

    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, filePath)
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]

            // callback( error, nombre del archivo)
            cb(null, `${shortid.generate()}.${extension}`)
        }
    })
    
    const configuracionMulter = { 
        storage: fileStorage,
        limits : {fileSize:1000000}, // (1Mb) For multipart forms, the max file size (in bytes).
        fileFilter(req, file, cb) {
            //Revisamos por mimetype porque la extensión se puede cambiar
            if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
                cb(null, true)
            } else {
                cb(new Error('The file must be an image (jpeg or png)'), false)
            }

            const fileSize = parseInt(req.headers['content-length']);
            if (fileSize > 148576) {
                return cb(new Error('el archivo esta bien pesado'));
            }
        }
    }

    // single('') Ahí se pone el name del file en el formulario
    const upload = multer(configuracionMulter).single('uploaded_file')
   
    // TODO: revisar la subida de archivos mayores a 1mb y formato diferente

    // upload llama a la constante upload, que llama a multer con la ocnfiguracionMulter...
    upload(req, res, function(error) {

        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'The file is too big: Max 1Mb ');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message)
            }
            res.redirect('/edit-profile')
            return;
        } else {
            return next();
        }
    });

    // para ver cosas relacionadas a multer
    // console.log(req.file) 
    // pero debe ser en el siguiente middleware
}

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
        tagline: 'You can change your Name, Email, or Image',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.userName,
        imagen: req.user.imagen
    })
}

// Guardar cambios editar perfil
async function editarPerfil(req, res) {

    console.log(req.file)
    console.log(req.flash)

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

    // Subir la imagen solo si existe
    if(req.file) {
        usuario.imagen = req.file.filename
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
            tagline: 'You can change your Name, Email, or Image',
            usuario: req.user.toObject(),
            cerrarSesion: true,
            nombre: req.user.userName,
            imagen: req.user.imagen,
            mensajes: req.flash()
        })
    } 

    next() // next to crearUsuario
}

export default {
    subirImagen,
    formCrearCuenta,
    validarRegistro,
    crearUsuaurio,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
    validaPerfil
}

