import express from 'express'
import { AssinaturaController } from '../controllers/allControllers.js'
import{ auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()
router.get('/', (req, res) => AssinaturaController.listarTodos(req, res), auth)
router.get('/campo', (req, res) => AssinaturaController.listarPorCampo(req, res), auth)
router.post('/', (req, res) => AssinaturaController.inserir(req, res))
router.put('/', (req, res) => AssinaturaController.atualizar(req, res))
router.delete('/', (req, res) => AssinaturaController.deletar(req, res))
router.get('/minha', auth, (req, res) =>
    AssinaturaController.minhaAssinatura(req, res))
router.put('/trocar', auth, (req, res) =>
    AssinaturaController.trocar(req, res))

export default router
