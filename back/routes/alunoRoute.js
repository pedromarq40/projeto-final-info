import express from 'express'
import { AlunoController } from '../controllers/allControllers.js'

const router = express.Router()

router.get('/', (req, res) => AlunoController.listarTodos(req, res))
router.get('/campo', (req, res) => AlunoController.listarPorCampo(req, res))
router.post('/', (req, res) => AlunoController.inserir(req, res))
router.put('/', (req, res) => AlunoController.atualizar(req, res))
router.delete('/', (req, res) => AlunoController.deletar(req, res))
router.post('/cadastro', (req, res) => AlunoController.novoAluno(req, res))
router.post('/login', (req, res) => AlunoController.loginAluno(req, res))
router.post('/logout', (req, res) => AlunoController.logoutAluno(req, res))

export default router
