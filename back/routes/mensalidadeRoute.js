import express from 'express'
import { MensalidadeController } from '../controllers/allControllers.js'
import{ auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()
router.get('/', (req, res) => MensalidadeController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => MensalidadeController.listarPorCampo(req, res), auth)
router.post('/', (req, res) => MensalidadeController.inserir(req, res), auth)
router.put('/', (req, res) => MensalidadeController.atualizar(req, res), auth)
router.delete('/', (req, res) => MensalidadeController.deletar(req, res), auth)

export default router
