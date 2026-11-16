import express from 'express'
import { MensalidadeController } from '../controllers/allControllers.js'

const router = express.Router()
router.get('/', (req, res) => MensalidadeController.listarTodos(req, res))
router.get('/campo', (req, res) => MensalidadeController.listarPorCampo(req, res))
router.post('/', (req, res) => MensalidadeController.inserir(req, res))
router.put('/', (req, res) => MensalidadeController.atualizar(req, res))
router.delete('/', (req, res) => MensalidadeController.deletar(req, res))

export default router
