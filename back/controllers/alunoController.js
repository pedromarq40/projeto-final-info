import BaseController from './baseController.js'
import AlunoModel from '../models/alunoModel.js'
import jwt from 'jsonwebtoken'

class AlunoController extends BaseController {
    static {
        this.definirModel(new AlunoModel())
    }

    static async loginAluno(req, res) {
        const { email, senha } = req.body

        try {
            const aluno = await this.model.login(email, senha)

            if (aluno) {
                const token = jwt.sign(
                    { id: aluno.CPF, role: "aluno" },
                    process.env.JWT,
                    { expiresIn: '1h' }
                )

                res.status(200).cookie('token', token, {
                    httpOnly: true,
                    secure: true,
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

    static async logoutAluno(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.status(200).json({
            message: 'Logout realizado com sucesso'
        })
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

    static async meusDados(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const alunos = await this.model.listarPorCampo({
                CPF: req.user.id
            })

            if (!alunos || alunos.length === 0) {
                return res.status(404).json({
                    error: 'Aluno não encontrado'
                })
            }

            const { senha, ...dados } = alunos[0]

            res.json(dados)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async atualizarDados(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const resultado = await this.model.atualizarDados(
                req.user.id,
                req.body
            )

            res.status(200).json({
                message: 'Dados atualizados com sucesso',
                linhasAlteradas: resultado.affectedRows
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
    static async deletar(req, res) {
    try {
        if (req.user.role !== 'aluno') {
            return res.status(403).json({
                error: 'Acesso permitido somente para alunos'
            })
        }

        const resultado = await this.model.deletar({
            CPF: req.user.id
        })

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: 'Aluno não encontrado'
            })
        }

        res.status(200).json({
            message: 'Conta excluída com sucesso'
        })

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}
}

export default AlunoController
