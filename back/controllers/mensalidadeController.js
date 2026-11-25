import BaseController from './baseController.js'
import MensalidadeModel from '../models/mensalidadeModel.js'

class MensalidadeController extends BaseController {
    static {
        this.definirModel(new MensalidadeModel())
    }

    static async minhasMensalidades(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso somente para alunos'
                })
            }

            const mensalidades = await this.model.listarDoAluno(req.user.id)

            res.json(mensalidades)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async mensalidadesDosAlunos(req, res) {
        try {
            if (!['professor', 'admin'].includes(req.user.role)) {
                return res.status(403).json({
                    error: 'Acesso permitido somente para professores e administradores'
                })
            }

            const mensalidades = await this.model.listarDosAlunos()

            res.json(mensalidades)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async pagar(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso somente para alunos'
                })
            }

            const { data_geracao } = req.body
            const id_plano = Number(req.body.id_plano)

            if (
                typeof data_geracao !== 'string' ||
                !/^\d{4}-\d{2}-\d{2}$/.test(data_geracao) ||
                !Number.isInteger(id_plano) ||
                id_plano < 1
            ) {
                return res.status(400).json({
                    error: 'Informe a mensalidade que deseja pagar'
                })
            }

            const resultado = await this.model.pagar(
                req.user.id,
                data_geracao,
                id_plano
            )

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Mensalidade não encontrada ou já paga'
                })
            }

            res.json({
                message: 'Pagamento registrado com sucesso'
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export default MensalidadeController
