import BaseModel from './baseModel.js'

class FichaDeTreinoModel extends BaseModel {
    constructor() {
        super('FichaDeTreino', [
            'id_ficha',
            'CPF',
            'foco',
            'tipo',
            'validade'
        ])
    }

    async buscarFichaComExercicios(CPF) {
    try {
        const [resultado] = await this.db.execute(`
            SELECT
                f.id_ficha,
                f.foco,
                f.tipo,
                f.validade,
                e.id_exercicio,
                e.nome AS exercicio,
                e.video,
                ef.carga,
                ef.series,
                ef.repeticoes
            FROM FichaDeTreino f
            LEFT JOIN ExercicioFicha ef
                ON f.id_ficha = ef.id_ficha
            LEFT JOIN exercicio e
                ON ef.id_exercicio = e.id_exercicio
            WHERE f.CPF = ?
        `, [CPF])

        return resultado
    } catch (err) {
        throw new Error(`Erro ao buscar ficha de treino: ${err.message}`)
    }

}
async criarFichaComExercicios(dados) {
    const conexao = await this.db.getConnection()

    try {
        await conexao.beginTransaction()

        const { CPF, foco, tipo, validade, exercicios } = dados

        // Verifica se o aluno já possui uma ficha
        const [fichasExistentes] = await conexao.execute(
            'SELECT id_ficha FROM FichaDeTreino WHERE CPF = ?',
            [CPF]
        )

        if (fichasExistentes.length > 0) {
            throw new Error('Esse aluno já possui uma ficha de treino')
        }

        // Gera o próximo ID da ficha
        const [resultadoId] = await conexao.execute(
            'SELECT COALESCE(MAX(id_ficha), 0) + 1 AS novoId FROM FichaDeTreino'
        )

        const id_ficha = resultadoId[0].novoId

        // Cria a ficha
        await conexao.execute(
            `INSERT INTO FichaDeTreino
            (id_ficha, CPF, foco, tipo, validade)
            VALUES (?, ?, ?, ?, ?)`,
            [id_ficha, CPF, foco, tipo, validade]
        )

        // Vincula os exercícios à ficha
        for (const exercicio of exercicios) {
            await conexao.execute(
                `INSERT INTO ExercicioFicha
                (id_exercicio, id_ficha, carga, series, repeticoes)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    exercicio.id_exercicio,
                    id_ficha,
                    exercicio.carga,
                    exercicio.series,
                    exercicio.repeticoes
                ]
            )
        }

        await conexao.commit()

        return { id_ficha }

    } catch (err) {
        await conexao.rollback()
        throw new Error(`Erro ao criar ficha de treino: ${err.message}`)
    } finally {
        conexao.release()
    }
}
}

export default FichaDeTreinoModel
