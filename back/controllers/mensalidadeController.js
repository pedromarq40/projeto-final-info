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

            const [mensalidades] = await this.model.db.execute(
                `SELECT DATE_FORMAT(m.data_geracao, '%Y-%m-%d') AS data_geracao,
                        m.CPF, m.id_plano, m.valor, m.vencimento, m.data_pagamento,
                        p.nome AS plano,
                        CASE
                            WHEN m.data_pagamento IS NOT NULL THEN 'paga'
                            WHEN m.vencimento < CURDATE() THEN 'atrasada'
                            ELSE 'pendente'
                        END AS status
                 FROM mensalidade m
                 JOIN plano p ON p.id_plano = m.id_plano
                 WHERE m.CPF = ?
                 ORDER BY m.vencimento ASC`,
                [req.user.id]
            )

            res.json(mensalidades)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async mensalidadesDosAlunos(req, res) {
        try {
            if (req.user.role !== 'professor') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para professores'
                })
            }

            const [mensalidades] = await this.model.db.execute(
                `SELECT a.CPF, a.nome_completo,
                        EXISTS(
                            SELECT 1 FROM assinatura s
                            WHERE s.CPF = a.CPF AND s.data_vencimento >= CURDATE()
                        ) AS assinatura_ativa,
                        m.data_geracao, m.id_plano,
                        m.valor, m.vencimento, m.data_pagamento,
                        p.nome AS plano,
                        CASE
                            WHEN m.data_pagamento IS NOT NULL THEN 'paga'
                            WHEN m.vencimento < CURDATE() THEN 'atrasada'
                            ELSE 'pendente'
                        END AS status
                 FROM aluno a
                 LEFT JOIN mensalidade m ON m.CPF = a.CPF
                 LEFT JOIN plano p ON p.id_plano = m.id_plano
                 ORDER BY a.nome_completo, m.vencimento DESC`
            )

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

            const [resultado] = await this.model.db.execute(
                `UPDATE mensalidade
                 SET data_pagamento = CURDATE()
                 WHERE CPF = ?
                 AND data_geracao = ?
                 AND id_plano = ?
                 AND data_pagamento IS NULL`,
                [req.user.id, data_geracao, id_plano]
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
