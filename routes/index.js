import express from 'express'
import homeController from '../controllers/homeController.js'
import vacantesController from '../controllers/vacantesController.js'
import usuariosController from '../controllers/usuariosController.js'
import authController from '../controllers/authController.js'

const router = express.Router()

router.get('/', homeController.mostrarTrabajos)

// Crear Vacantes
router.get('/vacancies/new', vacantesController.formularioNuevaVacante)
router.post('/vacancies/new', vacantesController.agregarVacante)

// Mostrar Vacante
router.get('/vacancies/:url', vacantesController.mostrarVacante)

// Editar Vacante
router.get('/vacancies/edit/:url', vacantesController.formEditarVacante)
router.post('/vacancies/edit/:url', vacantesController.editarVacante)

// Crear cuentas
router.get('/create-account', usuariosController.formCrearCuenta)
router.post('/create-account', usuariosController.validarRegistro, usuariosController.crearUsuaurio)

// autenticar Usuarios
router.get('/login', usuariosController.formIniciarSesion)
router.post('/login', authController.autenticarUsuario)

export default router