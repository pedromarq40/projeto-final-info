import express from 'express'
import { ExercicioFichaController } from '../controllers/allControllers.js'

const router = express.Router()
router.get('/', (req, res) => ExercicioFichaController.listarTodos(req, res))
router.get('/campo', (req, res) => ExercicioFichaController.listarPorCampo(req, res))
router.post('/', (req, res) => ExercicioFichaController.inserir(req, res))
router.put('/', (req, res) => ExercicioFichaController.atualizar(req, res))
router.delete('/', (req, res) => ExercicioFichaController.deletar(req, res))

export default router
