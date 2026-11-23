import BaseController from './baseController.js'
import ProfessorModel from '../models/professorModel.js'
import jwt from 'jsonwebtoken'

class ProfessorController extends BaseController {
    static {
        this.definirModel(new ProfessorModel())
    }

    static async loginProfessor(req, res) {
        const { email, senha } = req.body

        try {
            const professor = await this.model.login(email, senha)

            if (professor) {
                const token = jwt.sign(
                    { id: professor.CPF, role: "professor" },
                    process.env.JWT,
                    { expiresIn: '1h' }
                )

                res.status(200).cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 3600000
                }).json({ mensagem: "Login Efetuado com Sucesso!" })

            } else {
                res.status(401).json({ error: 'Credenciais inválidas' })
            }

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async inserir(req, res) {
        try {
            const dados = req.body
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

    static async logoutProfessor(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.status(200).json({
            message: 'Logout realizado com sucesso'
        })
    }
}

export default ProfessorController
