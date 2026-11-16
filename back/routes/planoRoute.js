import express from 'express'
import { PlanoController } from '../controllers/allControllers.js'

const router = express.Router()
router.get('/', (req, res) => PlanoController.listarTodos(req, res))
router.get('/campo', (req, res) => PlanoController.listarPorCampo(req, res))
router.post('/', (req, res) => PlanoController.inserir(req, res))
router.put('/', (req, res) => PlanoController.atualizar(req, res))
router.delete('/', (req, res) => PlanoController.deletar(req, res))

export default router
