import express from 'express'
import ProfessorController from '../controllers/professorController.js'
import { auth, inverseAuth} from '../auth/auth.js'

const router = express.Router()

router.get('/', auth, (req, res) => ProfessorController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => ProfessorController.listarPorCampo(req, res))
router.put('/', auth, (req, res) => ProfessorController.atualizar(req, res))
router.delete('/', auth, (req, res) => ProfessorController.deletar(req, res))
router.post('/cadastro', inverseAuth, (req, res) => ProfessorController.inserir(req, res))
router.post('/login', inverseAuth, (req, res) => ProfessorController.loginProfessor(req, res))
router.post('/logout', auth, (req, res) => ProfessorController.logoutProfessor(req, res))

export default router
