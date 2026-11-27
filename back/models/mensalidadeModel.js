import BaseModel from './baseModel.js'
import { readFile } from 'node:fs/promises'

const mensalidadesAlunoQuery = await readFile(
    new URL('../sql/buscar_mensalidades_aluno.sql', import.meta.url),
    'utf-8'
)

const mensalidadesAlunosQuery = await readFile(
    new URL('../sql/buscar_mensalidades_alunos.sql', import.meta.url),
    'utf-8'
)

function adicionarMeses(data, quantidade) {
    const [ano, mes, dia] = data.split('-').map(Number)

    const novaData = new Date(
        Date.UTC(ano, mes - 1 + quantidade, 1)
    )

    const ultimoDia = new Date(
        Date.UTC(
            novaData.getUTCFullYear(),
            novaData.getUTCMonth() + 1,
            0
        )
    ).getUTCDate()

    novaData.setUTCDate(Math.min(dia, ultimoDia))

    return novaData.toISOString().slice(0, 10)
}

class MensalidadeModel extends BaseModel {
    constructor() {
        super('mensalidade', [
            'data_geracao',
            'CPF',
            'id_plano',
            'valor',
            'vencimento',
            'data_pagamento',
            'status'
        ])
    }

    async listarDoAluno(CPF) {
        const [resultado] = await this.db.execute(
            mensalidadesAlunoQuery,
            [CPF]
        )
        return resultado
    }

    async listarDosAlunos() {
        const [resultado] = await this.db.execute(mensalidadesAlunosQuery)
        return resultado
    }

   async pagar(CPF, data_geracao, id_plano) {
    const [resultado] = await this.db.execute(
        `UPDATE mensalidade
         SET data_pagamento = CURDATE(),
             status = 'paga'
         WHERE CPF = ?
           AND data_geracao = ?
           AND id_plano = ?
           AND status = 'pendente'`,
        [CPF, data_geracao, id_plano]
    )
    return resultado
}

async cancelar(CPF, data_geracao, id_plano) {
    const [resultado] = await this.db.execute(
        `UPDATE mensalidade
         SET status = 'cancelada'
         WHERE CPF = ?
           AND data_geracao = ?
           AND id_plano = ?
           AND status = 'pendente'`,
        [CPF, data_geracao, id_plano]
    )

    return resultado
}

async gerarMensalidades() {
    const [assinaturas] = await this.db.execute(`
        SELECT
            a.CPF,
            a.id_plano,
            DATE_FORMAT(a.data_assinatura, '%Y-%m-%d') AS data_assinatura,
            DATE_FORMAT(a.data_vencimento, '%Y-%m-%d') AS data_vencimento,
            p.valor_mensal,
            p.nome
        FROM assinatura a
        INNER JOIN plano p
            ON a.id_plano = p.id_plano
    `)

    let totalInserido = 0

    for (const assinatura of assinaturas) {

        let intervalo = 1

        if (assinatura.nome.toLowerCase() === 'trimestral') {
            intervalo = 3
        }

        let dataCobranca = assinatura.data_assinatura

        while (dataCobranca <= assinatura.data_vencimento) {

            const [resultado] = await this.db.execute(`
                INSERT IGNORE INTO mensalidade
                (
                    data_geracao,
                    CPF,
                    id_plano,
                    valor,
                    vencimento,
                    data_pagamento
                )
                VALUES (
                    ?, ?, ?, ?,
                    DATE_ADD(?, INTERVAL 9 DAY),
                    NULL
                )
            `, [
                dataCobranca,
                assinatura.CPF,
                assinatura.id_plano,
                assinatura.valor_mensal,
                dataCobranca
            ])

            totalInserido += resultado.affectedRows

            dataCobranca = adicionarMeses(
                dataCobranca,
                intervalo
            )
        }
    }

    return totalInserido
}
}

export default MensalidadeModel
