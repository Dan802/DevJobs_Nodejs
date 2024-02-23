import express from 'express'
import homeController from '../controllers/homeController.js'
import vacantesController from '../controllers/vacantesController.js'

const router = express.Router()

router.get('/', homeController.mostrarTrabajos)

// Crear Vacantes
router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante)
router.post('/vacantes/nueva', vacantesController.agregarVacante)

export default router