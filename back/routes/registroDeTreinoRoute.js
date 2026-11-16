import express from 'express'
import { RegistroDeTreinoController } from '../controllers/allControllers.js'
import { auth } from '../auth/auth.js'

const router = express.Router()
router.get('/', (req, res) => RegistroDeTreinoController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => RegistroDeTreinoController.listarPorCampo(req, res), auth)
router.post('/', (req, res) => RegistroDeTreinoController.inserir(req, res), auth)
router.put('/', (req, res) => RegistroDeTreinoController.atualizar(req, res), auth)
router.delete('/', (req, res) => RegistroDeTreinoController.deletar(req, res), auth)

export default router
