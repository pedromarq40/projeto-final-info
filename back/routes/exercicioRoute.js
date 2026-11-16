import express from 'express'
import { ExercicioController } from '../controllers/allControllers.js'
import{ auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()
router.get('/', (req, res) => ExercicioController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => ExercicioController.listarPorCampo(req, res), auth)
router.post('/', (req, res) => ExercicioController.inserir(req, res), auth)
router.put('/', (req, res) => ExercicioController.atualizar(req, res), auth)
router.delete('/', (req, res) => ExercicioController.deletar(req, res), auth)

export default router
