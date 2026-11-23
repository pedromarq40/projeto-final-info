
import express from 'express'
import RegistroDeTreinoController from '../controllers/registroDeTreinoController.js'
import { auth } from '../auth/auth.js'

const router = express.Router()

router.get('/', auth, (req, res) => RegistroDeTreinoController.listarTodos(req, res))
router.get('/campo', auth, (req, res) => RegistroDeTreinoController.listarPorCampo(req, res))
router.post('/', auth, (req, res) => RegistroDeTreinoController.inserir(req, res))
router.put('/', auth, (req, res) => RegistroDeTreinoController.atualizar(req, res))
router.delete('/', auth, (req, res) => RegistroDeTreinoController.deletar(req, res))
router.get('/meus-registros', auth, (req, res) => RegistroDeTreinoController.meusRegistros(req, res))
router.post('/registrar', auth, (req, res) => RegistroDeTreinoController.registrar(req, res))

export default router
