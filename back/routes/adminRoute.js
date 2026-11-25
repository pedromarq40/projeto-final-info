import express from 'express'
import AdminController from '../controllers/adminController.js'
import { auth, inverseAuth } from '../auth/auth.js'

const router = express.Router()

router.post('/cadastro', auth, (req, res) => AdminController.inserir(req, res))
router.post('/login', inverseAuth, (req, res) => AdminController.loginAdmin(req, res))
router.post('/logout', auth, (req, res) => AdminController.logoutAdmin(req, res))
router.get('/relatorios', auth, (req, res) => AdminController.relatorios(req, res))

export default router
