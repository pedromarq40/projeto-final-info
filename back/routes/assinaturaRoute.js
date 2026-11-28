import express from 'express'
import AssinaturaController from '../controllers/assinaturaController.js'
import { auth } from '../auth/auth.js'

const router = express.Router()
router.get('/', auth, (req, res) => AssinaturaController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => AssinaturaController.listarPorCampo(req, res))
router.get('/ativas', auth, (req, res) => AssinaturaController.assinaturasAtivasDosAlunos(req, res))
router.post('/', auth, (req, res) => AssinaturaController.inserir(req, res))
router.put('/', auth, (req, res) => AssinaturaController.atualizar(req, res))
router.delete('/', auth, (req, res) => AssinaturaController.deletar(req, res))
router.get('/minha', auth, (req, res) => AssinaturaController.minhaAssinatura(req, res))
router.put('/trocar', auth, (req, res) => AssinaturaController.trocar(req, res))
router.put('/cancelar', auth, (req, res) => AssinaturaController.cancelar(req, res))
export default router
