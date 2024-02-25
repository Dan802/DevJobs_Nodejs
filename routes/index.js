import express from 'express'
import homeController from '../controllers/homeController.js'
import vacantesController from '../controllers/vacantesController.js'

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

export default router