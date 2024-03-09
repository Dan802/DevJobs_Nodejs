import { body, validationResult } from 'express-validator'
import multer from 'multer'
import shortid from 'shortid'
import { fileURLToPath } from 'url'

// Importar modelo de la base de datos
import mongoose from "mongoose"
const Vacante = mongoose.model('Vacante')


function formularioNuevaVacante(req, res) {

    res.render('nueva-vacante', {
        page: 'New Position',
        tagLine: 'Fill out the form and publish your job opening',
        cerrarSesion: true,
        nombre: req.user.userName,
        imagen: req.user.imagen
    })
}

// Guardar una nueva vacante en la base de datos
async function agregarVacante(req, res) {

    const vacante = new Vacante(req.body)

    // Creador de la vacante
    vacante.autor = req.user._id

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
    const vacante = await Vacante.findOne({url: req.params.url}).populate('autor').lean()
    
    if(!vacante) return next()
    
    vacante.autor.password = '' // Eliminamos la contraseña del creador de la vacante por seguridad
    
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
        page: `Edit - ${vacante.title}`,
        cerrarSesion: true,
        nombre: req.user.userName,
        imagen: req.user.imagen
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

// Validar y sanitizar los campos de las vacantes
async function validarVacante(req, res, next) {
    
    const rules = [
        // Sanitizar los campos 
        body('title').escape(),
        body('company').escape(),
        body('ubication').escape(),
        body('salary').escape(),
        body('contract').escape(),
        body('skills').escape(),

        // Validar
        body('title', 'The title is required').notEmpty(),
        body('company', 'The company is required').notEmpty(),
        body('ubication', 'The ubication is required').notEmpty(),
        body('contract', 'Select the type of contract').notEmpty(),
        body('skills', 'Add at least one skill').notEmpty()
    ]

    // Añadimos los errores al req
    await Promise.all(rules.map(validation => validation.run(req)));

    // Y luego los validamos
    const errores = validationResult(req)

    if(!errores.isEmpty()) {

        const errorMessages =  errores.array().map(error => error.msg)
        
        req.flash('error', errorMessages)

        //TODO añadir la validacióny vista para editar vacante

        return res.render('nueva-vacante', {
            page: 'New Position',
            tagLine: 'Fill out the form and publish your job opening',
            cerrarSesion: true,
            nombre: req.user.userName,
            mensajes: req.flash()
        })
    }

    next()
}

// Eliminar Vacante
async function eliminarVacante(req, res) {

    // 1. Se envia la petición por medio de axios en 
    // app.js => accionesListado
    
    const {id} = req.params

    const vacante = await Vacante.findById(id)

    if (!vacante) {
        return res.status(403).send("Position not found");
    }

    if(verificarAutor(vacante, req.user)) {
        await vacante.deleteOne()
        res.status(200).send('Positon deleted successfully')
    } else {
        // el usuario no es el dueño de la vacante
        res.status(403).send('There was an error')
    }
}

/** Verifica el autor de una vacante
 * @param {*} vacante 
 * @param {*} usuario 
 * @returns bool  
 */
function verificarAutor(vacante = {}, usuario = {}) {
    if(!vacante.autor.equals(usuario._id)) {
        return false
    } else {
        return true
    }
}

/** Subir archivos en PDF 
 */
function subirCV(req, res, next) {

    const filePath = fileURLToPath(new URL('../public/uploads/cv', import.meta.url)) // root\public\uploads\perfiles

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
        limits : {fileSize : 1000000 }, // (1Mb) For multipart forms, the max file size (in bytes).
        fileFilter(req, file, cb) {
            //Revisamos por mimetype porque la extensión se puede cambiar
            if(file.mimetype === 'application/pdf'){
                cb(null, true)
            } else {
                cb(new Error('The file must be an PDF'), false)
            }
        }
    }
    
    // single('') Ahí se pone el name del file en el formulario
    const upload = multer(configuracionMulter).single('cv')

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
            res.redirect('back') // Si detecta un error nos reenvia a la página donde se originó el error
            return;
        } else {
            return next();
        }
    });
}

/** Almacenar los candidatos en al base de datos
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function contactar(req, res, next) {

    const vacante = await Vacante.findOne({url: req.params.url})

    if(!vacante) return next()

    const nuevoCandidato = {
        nameCandidate: req.body.userName,
        emailCandidate : req.body.email,
        cvCandidate: req.file.filename
    }

    // Almacenar la vacante
    vacante.candidates.push(nuevoCandidato)
    await vacante.save()

    req.flash('correcto', 'Your cv was succesfully sent')
    res.redirect('/')
}

async function mostrarCandidatos(req, res, next) {

    const vacante = await Vacante.findById(req.params.id).lean()

    if(!vacante) return next()

    if(vacante.autor != req.user._id.toString()) {
        return next()
    }

    console.log(vacante.candidates)

    res.render('candidatos', {
        page:  `Candidates of the position ${vacante.title}`,
        cerrarSesion: true,
        userName: req.user.userName,
        imagen: req.user.imagen,
        candidatos : vacante.candidates
    })
}

// Buscador de vacantes
async function buscarVacantes(req, res) {

    const vacantes = await Vacante.find({
        $text: {
            $search: req.body.q
        }
    }).lean()

    const query = req.body.q
    const queryCapitalize = query.charAt(0).toUpperCase() + query.slice(1) 

    // mostrar las vacantes
    res.render('home', {
        page: `Results for the search ${queryCapitalize}`,
        barra: true,
        vacantes

    })
}

export default {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    validarVacante,
    eliminarVacante,
    subirCV,
    contactar,
    mostrarCandidatos,
    buscarVacantes
}