import express from 'express'
import { AlunoController } from '../controllers/allControllers.js'
import{ auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()

router.get('/', (req, res) => AlunoController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => AlunoController.listarPorCampo(req, res), auth)
router.put('/', (req, res) => AlunoController.atualizar(req, res), auth)
router.delete('/', (req, res) => AlunoController.deletar(req, res), auth)
router.post('/cadastro', (req, res) => AlunoController.inserir(req, res), inverseAuth)
router.post('/login', (req, res) => AlunoController.loginAluno(req, res), inverseAuth)
router.post('/logout', (req, res) => AlunoController.logoutAluno(req, res), auth)

export default router
