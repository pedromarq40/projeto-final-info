import express from 'express'
import PlanoController from '../controllers/planoController.js'
import { auth } from '../auth/auth.js'

const router = express.Router()
router.get('/', auth, (req, res) => PlanoController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => PlanoController.listarPorCampo(req, res))
router.post('/', auth, (req, res) => PlanoController.inserir(req, res))
router.put('/:id', auth, (req, res) => PlanoController.atualizar(req, res))
router.delete('/:id', auth, (req, res) => PlanoController.deletar(req, res))

export default router
