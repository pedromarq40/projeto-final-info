import BaseController from './baseController.js'
import AssinaturaModel from '../models/assinaturaModel.js'

class AssinaturaController extends BaseController {
    static {
        this.definirModel(new AssinaturaModel())
    }

    static async minhaAssinatura(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso somente para alunos'
                })
            }

            const [assinatura] = await this.model.db.execute(
                `SELECT a.*, p.nome, p.valor_mensal,
                        TIMESTAMPDIFF(MONTH, a.data_assinatura, a.data_vencimento) AS duracao_meses
                 FROM assinatura a
                 JOIN plano p ON p.id_plano = a.id_plano
                 WHERE a.CPF = ?`,
                [req.user.id]
            )

            res.json(assinatura)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async trocar(req, res) {
        if (req.user.role !== 'aluno') {
            return res.status(403).json({
                error: 'Acesso somente para alunos'
            })
        }

        const id_plano = Number(req.body.id_plano)
        const duracao_meses = Number(req.body.duracao_meses)

        if (!Number.isInteger(id_plano) || id_plano < 1) {
            return res.status(400).json({
                error: 'Selecione um plano'
            })
        }

        if (!Number.isInteger(duracao_meses) || duracao_meses < 1 || duracao_meses > 24) {
            return res.status(400).json({
                error: 'A duração deve ser de 1 a 24 meses'
            })
        }

        const conexao = await this.model.db.getConnection()

        try {
            await conexao.beginTransaction()

            const [planos] = await conexao.execute(
                `SELECT id_plano, valor_mensal
                 FROM plano
                 WHERE id_plano = ? AND efetivo = TRUE`,
                [id_plano]
            )

            if (planos.length === 0) {
                await conexao.rollback()
                return res.status(404).json({
                    error: 'Plano não encontrado'
                })
            }

            const [atuais] = await conexao.execute(
                `SELECT id_assinatura, data_vencimento >= CURDATE() AS ativa
                 FROM assinatura
                 WHERE CPF = ?
                 FOR UPDATE`,
                [req.user.id]
            )

            if (atuais.length > 0 && atuais[0].ativa) {
                await conexao.rollback()
                return res.status(409).json({
                    error: 'Você já possui uma assinatura vigente'
                })
            }

            if (atuais.length > 0) {
                await conexao.execute(
                    `UPDATE assinatura
                     SET id_plano = ?, data_assinatura = CURDATE(),
                         data_vencimento = DATE_ADD(CURDATE(), INTERVAL ? MONTH)
                     WHERE CPF = ?`,
                    [id_plano, duracao_meses, req.user.id]
                )
            } else {
                await conexao.execute(
                    `INSERT INTO assinatura
                     (id_plano, CPF, data_assinatura, data_vencimento)
                     VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? MONTH))`,
                    [id_plano, req.user.id, duracao_meses]
                )
            }

            for (let parcela = 1; parcela <= duracao_meses; parcela += 1) {
                await conexao.execute(
                    `INSERT INTO mensalidade
                     (data_geracao, CPF, id_plano, valor, vencimento, data_pagamento)
                     VALUES (
                         DATE_ADD(CURDATE(), INTERVAL ? MONTH),
                         ?, ?, ?,
                         DATE_ADD(CURDATE(), INTERVAL ? MONTH),
                         NULL
                     )`,
                    [
                        parcela - 1,
                        req.user.id,
                        id_plano,
                        planos[0].valor_mensal,
                        parcela
                    ]
                )
            }

            await conexao.commit()
            return res.status(201).json({
                message: 'Assinatura e mensalidades cadastradas com sucesso',
                duracao_meses
            })
        } catch (err) {
            await conexao.rollback()
            return res.status(500).json({
                error: err.message
            })
        } finally {
            conexao.release()
        }
    }

}

export default AssinaturaController
