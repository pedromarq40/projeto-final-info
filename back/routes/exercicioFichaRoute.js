
import express from 'express'
import ExercicioFichaController from '../controllers/exercicioFichaController.js'
import { auth } from '../auth/auth.js'

const router = express.Router()

router.get('/', auth, (req, res) => ExercicioFichaController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => ExercicioFichaController.listarPorCampo(req, res))
router.post('/', auth, (req, res) => ExercicioFichaController.inserir(req, res))
router.put('/', auth, (req, res) => ExercicioFichaController.atualizar(req, res))
router.delete('/', auth, (req, res) => ExercicioFichaController.deletar(req, res))

export default router
