import express from 'express'
import AlunoController from '../controllers/alunoController.js'
import { auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()

router.get('/', auth, (req, res) => AlunoController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => AlunoController.listarPorCampo(req, res))
router.put('/', auth, (req, res) => AlunoController.atualizar(req, res))
router.delete('/', auth, (req, res) => AlunoController.deletar(req, res))
router.post('/cadastro', inverseAuth, (req, res) => AlunoController.inserir(req, res))
router.post('/login', inverseAuth, (req, res) => AlunoController.loginAluno(req, res))
router.post('/logout', auth, (req, res) => AlunoController.logoutAluno(req, res))
router.put('/meus-dados', auth, (req, res) => AlunoController.atualizarDados(req, res))
router.get('/meus-dados', auth, (req, res) => AlunoController.meusDados(req, res))
export default router

