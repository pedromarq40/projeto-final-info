import express from 'express'
import { AssinaturaController } from '../controllers/allControllers.js'

const router = express.Router()
router.get('/', (req, res) => AssinaturaController.listarTodos(req, res))
router.get('/campo', (req, res) => AssinaturaController.listarPorCampo(req, res))
router.post('/', (req, res) => AssinaturaController.inserir(req, res))
router.put('/', (req, res) => AssinaturaController.atualizar(req, res))
router.delete('/', (req, res) => AssinaturaController.deletar(req, res))

export default router
