import express from 'express'
import homeController from '../controllers/homeController.js'
import vacantesController from '../controllers/vacantesController.js'
import usuariosController from '../controllers/usuariosController.js'
import authController from '../controllers/authController.js'

const router = express.Router()

router.get('/', homeController.mostrarTrabajos)

// Crear Vacantes
router.get('/vacancies/new', authController.verificarUsuario, vacantesController.formularioNuevaVacante)
router.post('/vacancies/new', authController.verificarUsuario, vacantesController.validarVacante, vacantesController.agregarVacante)

// Mostrar Vacante
router.get('/vacancies/:url', vacantesController.mostrarVacante)

// Editar Vacante
router.get('/vacancies/edit/:url', authController.verificarUsuario, vacantesController.formEditarVacante)
router.post('/vacancies/edit/:url', authController.verificarUsuario, vacantesController.validarVacante, vacantesController.editarVacante)

// Eliminar Vacante
router.delete('/vacancies/delete/:id', vacantesController.eliminarVacante)

// Crear cuentas
router.get('/create-account', usuariosController.formCrearCuenta)
router.post('/create-account', usuariosController.validarRegistro, usuariosController.crearUsuaurio)

// autenticar Usuarios
router.get('/login', usuariosController.formIniciarSesion)
router.post('/login', authController.autenticarUsuario)
router.get('/logout', authController.verificarUsuario, authController.cerrarSesion)

// Panel de administración 
router.get('/admin', authController.verificarUsuario, authController.mostrarPanel)

// Editar perfil
router.get('/edit-profile', authController.verificarUsuario, usuariosController.formEditarPerfil)
router.post('/edit-profile', authController.verificarUsuario, usuariosController.validaPerfil, usuariosController.editarPerfil)

export default router