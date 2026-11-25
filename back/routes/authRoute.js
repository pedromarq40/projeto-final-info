import express from 'express'
import AlunoModel from '../models/alunoModel.js'
import AdminModel from '../models/adminModel.js'
import ProfessorModel from '../models/professorModel.js'
import { auth } from '../auth/auth.js'

const router = express.Router()

router.get('/me', auth, async (req, res) => {
    try {
        const { id, role } = req.user

        const models = {
            "aluno": AlunoModel,
            "professor": ProfessorModel,
            "admin": AdminModel
        }

        const model = new models[role]()

        const rows = await model.listarPorCampo({CPF:id})

        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Usuário não encontrado.'
            })
        }

        const { senha, ...dadosUsuario } = rows[0]
        res.json({ user: { ...dadosUsuario, role } })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Erro ao buscar usuário.'
        })
    }
})

export default router