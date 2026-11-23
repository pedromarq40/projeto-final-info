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

class MensalidadeModel extends BaseModel {
    constructor() {
        super('mensalidade', [
            'data_geracao',
            'CPF',
            'id_plano',
            'valor',
            'vencimento',
            'data_pagamento'
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
             SET data_pagamento = CURDATE()
             WHERE CPF = ?
               AND data_geracao = ?
               AND id_plano = ?
               AND data_pagamento IS NULL`,
            [CPF, data_geracao, id_plano]
        )
        return resultado
    }

}

export default MensalidadeModel
