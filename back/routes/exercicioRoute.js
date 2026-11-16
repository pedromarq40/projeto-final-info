import express from 'express'
import { ExercicioController } from '../controllers/allControllers.js'

const router = express.Router()
router.get('/', (req, res) => ExercicioController.listarTodos(req, res))
router.get('/campo', (req, res) => ExercicioController.listarPorCampo(req, res))
router.post('/', (req, res) => ExercicioController.inserir(req, res))
router.put('/', (req, res) => ExercicioController.atualizar(req, res))
router.delete('/', (req, res) => ExercicioController.deletar(req, res))

export default router
