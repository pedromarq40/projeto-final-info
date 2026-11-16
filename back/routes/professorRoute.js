import express from 'express'
import { ProfessorController } from '../controllers/allControllers.js'

const router = express.Router()

router.get('/', (req, res) => ProfessorController.listarTodos(req, res))
router.get('/campo', (req, res) => ProfessorController.listarPorCampo(req, res))
router.post('/', (req, res) => ProfessorController.inserir(req, res))
router.put('/', (req, res) => ProfessorController.atualizar(req, res))
router.delete('/', (req, res) => ProfessorController.deletar(req, res))
router.post('/cadastro', (req, res) => ProfessorController.novoProfessor(req, res))
router.post('/login', (req, res) => ProfessorController.loginProfessor(req, res))
router.post('/logout', (req, res) => ProfessorController.logoutProfessor(req, res))

export default router
