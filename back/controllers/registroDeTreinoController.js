import BaseController from './baseController.js'
import RegistroDeTreinoModel from '../models/registroDeTreinoModel.js'

class RegistroDeTreinoController extends BaseController {
    static {
        this.definirModel(new RegistroDeTreinoModel())
    }

    static async meusRegistros(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const [fichas] = await this.model.db.execute(
                'SELECT id_ficha FROM FichaDeTreino WHERE CPF = ?',
                [req.user.id]
            )

            if (fichas.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            const [registros] = await this.model.db.execute(
                `SELECT data_registro, hora, duracao
                 FROM RegistroDeTreino
                 WHERE id_ficha = ?
                 ORDER BY data_registro DESC`,
                [fichas[0].id_ficha]
            )

            res.status(200).json(registros)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async registrar(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const { data_registro, hora, duracao } = req.body

            if (!data_registro || !hora || !duracao) {
                return res.status(400).json({
                    error: 'Preencha todos os campos'
                })
            }

            const [fichas] = await this.model.db.execute(
                'SELECT id_ficha FROM FichaDeTreino WHERE CPF = ?',
                [req.user.id]
            )

            if (fichas.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            await this.model.inserir({
                data_registro,
                id_ficha: fichas[0].id_ficha,
                hora,
                duracao
            })

            res.status(201).json({
                message: 'Treino registrado com sucesso'
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export default RegistroDeTreinoController
