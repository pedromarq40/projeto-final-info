import BaseController from './baseController.js'
import AdminModel from '../models/adminModel.js'
import jwt from 'jsonwebtoken'

class AdminController extends BaseController {
    static {
        this.definirModel(new AdminModel())
    }

    static async loginAdmin(req, res) {
        const { email, senha } = req.body

        try {
            const admin = await this.model.login(email, senha)

            if (!admin) {
                return res.status(401).json({ error: 'Credenciais inválidas' })
            }

            const token = jwt.sign(
                { id: admin.CPF, role: 'admin' },
                process.env.JWT,
                { expiresIn: '1h' }
            )

            res.status(200).cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            }).json({ mensagem: 'Login Efetuado com Sucesso!' })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async inserir(req, res) {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                error: 'Acesso permitido somente para administradores'
            })
        }

        try {
            const dados = Object.fromEntries(
                this.model.colunas
                    .filter(coluna => coluna in req.body)
                    .map(coluna => [coluna, req.body[coluna]])
            )
            dados.senha = await this.model.hashPassword(dados.senha)

            const resultado = await this.model.inserir(dados)

            res.json({
                message: 'Registro inserido com sucesso',
                id: resultado.insertId
            })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async relatorios(req, res) {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                error: 'Acesso permitido somente para administradores'
            })
        }

        try {
            const relatorios = await this.model.obterRelatorios()
            res.json(relatorios)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async logoutAdmin(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        res.status(200).json({ message: 'Logout realizado com sucesso' })
    }
}

export default AdminController
