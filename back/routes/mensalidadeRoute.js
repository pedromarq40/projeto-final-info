import express from 'express'
import MensalidadeController from '../controllers/mensalidadeController.js'
import { auth } from '../auth/auth.js'

const router = express.Router()

router.get('/', auth, (req, res) => MensalidadeController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => MensalidadeController.listarPorCampo(req, res))
router.post('/', auth, (req, res) => MensalidadeController.inserir(req, res))
router.put('/', auth, (req, res) => MensalidadeController.atualizar(req, res))
router.delete('/', auth, (req, res) => MensalidadeController.deletar(req, res))
router.get('/alunos', auth, (req, res) => MensalidadeController.mensalidadesDosAlunos(req, res))
router.get('/minhas', auth, (req, res) => MensalidadeController.minhasMensalidades(req, res))
router.put('/pagar', auth, (req, res) => MensalidadeController.pagar(req, res))
router.post('/gerar', auth, (req, res) => MensalidadeController.gerarMensalidades(req, res)
)
router.put('/cancelar', auth, (req, res) => MensalidadeController.cancelar(req, res)
)

export default router