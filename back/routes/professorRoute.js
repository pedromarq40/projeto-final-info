import express from 'express'
import { ProfessorController } from '../controllers/allControllers.js'
import { auth, inverseAuth} from '../auth/auth.js'

const router = express.Router()

router.get('/', (req, res) => ProfessorController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => ProfessorController.listarPorCampo(req, res), auth)
router.put('/', (req, res) => ProfessorController.atualizar(req, res), auth)
router.delete('/', (req, res) => ProfessorController.deletar(req, res), auth)
router.post('/cadastro', (req, res) => ProfessorController.inserir(req, res), inverseAuth)
router.post('/login', (req, res) => ProfessorController.loginProfessor(req, res), inverseAuth)
router.post('/logout', (req, res) => ProfessorController.logoutProfessor(req, res), auth)

export default router
