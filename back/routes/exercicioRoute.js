import express from 'express'
import ExercicioController from '../controllers/exercicioController.js'
import { auth } from '../auth/auth.js'

const router = express.Router()
router.get('/', auth, (req, res) => ExercicioController.listarPaginado(req, res))
router.get('/campo', auth, (req, res) => ExercicioController.listarPorCampo(req, res))
router.post('/', auth, (req, res) => ExercicioController.criar(req, res))
router.put('/:id', auth, (req, res) => ExercicioController.atualizarExercicio(req, res))
router.delete('/:id', auth, (req, res) => ExercicioController.deletarExercicio(req, res))

export default router
