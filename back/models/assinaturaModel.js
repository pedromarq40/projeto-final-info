
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
    async cancelar(CPF) {
    const conexao = await this.db.getConnection()

    try {
        await conexao.beginTransaction()

        const [assinaturas] = await conexao.execute(
            `SELECT CPF
             FROM assinatura
             WHERE CPF = ?
               AND data_vencimento >= CURDATE()
             FOR UPDATE`,
            [CPF]
        )

        if (assinaturas.length === 0) {
            await conexao.rollback()
            return { status: 404 }
        }

        await conexao.execute(
            `UPDATE assinatura
             SET data_vencimento = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
             WHERE CPF = ?`,
            [CPF]
        )

        await conexao.execute(
            `UPDATE mensalidade
             SET status = 'cancelada'
             WHERE CPF = ?
               AND status = 'pendente'
               AND vencimento > CURDATE()`,
            [CPF]
        )

        await conexao.commit()
        return { status: 200 }

    } catch (err) {
        await conexao.rollback()
        throw err
    } finally {
        conexao.release()
    }
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

            const nomePlano = planos[0].nome.trim().toLowerCase()
            const intervalo = nomePlano.includes('trimestral') ? 3 : 1

            if (duracao_meses % intervalo !== 0) {
                await conexao.rollback()
                return { status: 400 }
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

           for (
    let parcela = 0;
    parcela <= duracao_meses - 1;
    parcela += intervalo
) {
    await conexao.execute(
        `INSERT INTO mensalidade
         (
             data_geracao,
             CPF,
             id_plano,
             valor,
             vencimento,
             data_pagamento,
             status
         )
         VALUES (
             DATE_ADD(NOW(6), INTERVAL ? MONTH),
             ?, ?, ?,
             DATE_ADD(
                 DATE_ADD(CURDATE(), INTERVAL ? MONTH),
                 INTERVAL 9 DAY
             ),
             NULL,
             'pendente'
         )`,
        [
            parcela,
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
