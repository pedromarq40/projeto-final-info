import express from 'express'
import { FichaDeTreinoController } from '../controllers/allControllers.js'

const router = express.Router()
router.get('/', (req, res) => FichaDeTreinoController.listarTodos(req, res))
router.get('/campo', (req, res) => FichaDeTreinoController.listarPorCampo(req, res))
router.post('/', (req, res) => FichaDeTreinoController.inserir(req, res))
router.put('/', (req, res) => FichaDeTreinoController.atualizar(req, res))
router.delete('/', (req, res) => FichaDeTreinoController.deletar(req, res))

export default router
