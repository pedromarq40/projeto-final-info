import express from 'express'
import { RegistroDeTreinoController } from '../controllers/allControllers.js'

const router = express.Router()
router.get('/', (req, res) => RegistroDeTreinoController.listarTodos(req, res))
router.get('/campo', (req, res) => RegistroDeTreinoController.listarPorCampo(req, res))
router.post('/', (req, res) => RegistroDeTreinoController.inserir(req, res))
router.put('/', (req, res) => RegistroDeTreinoController.atualizar(req, res))
router.delete('/', (req, res) => RegistroDeTreinoController.deletar(req, res))

export default router
