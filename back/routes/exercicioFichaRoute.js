import express from 'express'
import { ExercicioFichaController } from '../controllers/allControllers.js'
import{ auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()
router.get('/', (req, res) => ExercicioFichaController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => ExercicioFichaController.listarPorCampo(req, res), auth)
router.post('/', (req, res) => ExercicioFichaController.inserir(req, res), auth)
router.put('/', (req, res) => ExercicioFichaController.atualizar(req, res), auth)
router.delete('/', (req, res) => ExercicioFichaController.deletar(req, res), auth)

export default router
