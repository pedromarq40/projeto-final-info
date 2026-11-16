import express from 'express'
import { FichaDeTreinoController } from '../controllers/allControllers.js'
import{ auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()
router.get('/', (req, res) => FichaDeTreinoController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => FichaDeTreinoController.listarPorCampo(req, res), auth)
router.post('/', (req, res) => FichaDeTreinoController.inserir(req, res), auth)
router.put('/', (req, res) => FichaDeTreinoController.atualizar(req, res), auth)
router.delete('/', (req, res) => FichaDeTreinoController.deletar(req, res), auth)

export default router
