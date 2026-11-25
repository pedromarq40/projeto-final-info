import BaseModel from './baseModel.js'
import PlanoModel from './planoModel.js'
import { readFile } from 'node:fs/promises'

const minhaAssinaturaQuery = await readFile(
    new URL('../sql/buscar_minha_assinatura.sql', import.meta.url),
    'utf-8'
)

const assinaturasAtivasAlunosQuery = await readFile(
    new URL('../sql/buscar_assinaturas_ativas_alunos.sql', import.meta.url),
    'utf-8'
)

class AssinaturaModel extends BaseModel {
    constructor() {
        super('assinatura', [
            'id_assinatura',
            'id_plano',
            'CPF',
            'data_assinatura',
            'data_vencimento'
        ])
    }

    async buscarMinha(CPF) {
        const [resultado] = await this.db.execute(
            minhaAssinaturaQuery,
            [CPF]
        )
        return resultado
    }

    async listarAtivasDosAlunos() {
        const [resultado] = await this.db.execute(assinaturasAtivasAlunosQuery)
        return resultado
    }

    async trocar(CPF, id_plano, duracao_meses) {
        const conexao = await this.db.getConnection()

        try {
            await conexao.beginTransaction()

            const planoModel = new PlanoModel()
            const planos = await planoModel.listarPorCampo({
                id_plano,
                efetivo: true
            })

            if (planos.length === 0) {
                await conexao.rollback()
                return { status: 404 }
            }

            const [atuais] = await conexao.execute(
                `SELECT id_assinatura, data_vencimento >= CURDATE() AS ativa
                 FROM assinatura
                 WHERE CPF = ?
                 FOR UPDATE`,
                [CPF]
            )

            if (atuais.length > 0 && atuais[0].ativa) {
                await conexao.rollback()
                return { status: 409 }
            }

            if (atuais.length > 0) {
                await conexao.execute(
                    `UPDATE assinatura
                     SET id_plano = ?,
                         data_assinatura = CURDATE(),
                         data_vencimento = DATE_ADD(CURDATE(), INTERVAL ? MONTH)
                     WHERE CPF = ?`,
                    [id_plano, duracao_meses, CPF]
                )
            } else {
                await conexao.execute(
                    `INSERT INTO assinatura
                     (id_plano, CPF, data_assinatura, data_vencimento)
                     VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? MONTH))`,
                    [id_plano, CPF, duracao_meses]
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
                        CPF,
                        id_plano,
                        planos[0].valor_mensal,
                        parcela
                    ]
                )
            }

            await conexao.commit()
            return { status: 201, duracao_meses }
        } catch (err) {
            await conexao.rollback()
            throw err
        } finally {
            conexao.release()
        }
    }

}

export default AssinaturaModel
