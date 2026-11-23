
import express from 'express'
import FichaDeTreinoController from '../controllers/fichaDeTreinoController.js'
import { auth } from '../auth/auth.js'

const router = express.Router()

router.get('/minha-ficha', auth, (req, res) => FichaDeTreinoController.minhaFicha(req, res))
router.get('/editar/:CPF', auth, (req, res) => FichaDeTreinoController.buscarParaEdicao(req, res))
router.post('/criar', auth, (req, res) => FichaDeTreinoController.criarFicha(req, res))
router.put('/editar/:CPF', auth, (req, res) => FichaDeTreinoController.atualizarFicha(req, res))
router.get('/', auth, (req, res) => FichaDeTreinoController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => FichaDeTreinoController.listarPorCampo(req, res))
router.post('/', auth, (req, res) => FichaDeTreinoController.inserir(req, res))
router.put('/', auth, (req, res) => FichaDeTreinoController.atualizar(req, res))
router.delete('/', auth, (req, res) => FichaDeTreinoController.deletar(req, res))

export default router
