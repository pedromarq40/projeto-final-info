import BaseModel from './baseModel.js'
import FichaDeTreinoModel from './fichaDeTreinoModel.js'
import ExercicioFichaModel from './exercicioFichaModel.js'

class RegistroDeTreinoModel extends BaseModel {
    constructor() {
        super('RegistroDeTreino', [
            'data_registro',
            'id_ficha',
            'hora',
            'duracao'
        ])
    }

    async buscarFichaPorCpf(CPF) {
        const fichaModel = new FichaDeTreinoModel()
        return await fichaModel.listarPorCampo({ CPF })
    }

   async buscarPorFicha(id_ficha) {
    const [resultado] = await this.db.execute(
        `SELECT
            rt.id_registro,
            rt.id_ficha,
            rt.data_registro,
            rt.hora,
            rt.duracao,
            er.id_exercicio,
            e.nome AS exercicio,
            er.carga_realizada,
            er.series_realizadas,
            er.repeticoes_realizadas,
            er.concluido,
            ef.ordem
         FROM RegistroDeTreino rt
         LEFT JOIN ExercicioRealizado er
            ON rt.id_registro = er.id_registro
         LEFT JOIN exercicio e
            ON er.id_exercicio = e.id_exercicio
         LEFT JOIN ExercicioFicha ef
            ON ef.id_ficha = rt.id_ficha
            AND ef.id_exercicio = er.id_exercicio
         WHERE rt.id_ficha = ?
         ORDER BY rt.data_registro DESC, rt.hora DESC, ef.ordem ASC`,
        [id_ficha]
    )

    return resultado
}
    async inserirComExercicios(dados, exercicios) {
        const conexao = await this.db.getConnection()

        try {
            await conexao.beginTransaction()

            const [resultado] = await conexao.execute(
                `INSERT INTO RegistroDeTreino
             (data_registro, id_ficha, hora, duracao)
             VALUES (?, ?, ?, ?)`,
                [
                    dados.data_registro,
                    dados.id_ficha,
                    dados.hora,
                    dados.duracao
                ]
            )

            const id_registro = resultado.insertId

            for (const exercicio of exercicios) {
                await conexao.execute(
                    `INSERT INTO ExercicioRealizado
                 (id_registro, id_exercicio, carga_realizada,
                  series_realizadas, repeticoes_realizadas, concluido)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        id_registro,
                        exercicio.id_exercicio,
                        exercicio.carga_realizada,
                        exercicio.series_realizadas,
                        exercicio.repeticoes_realizadas,
                        exercicio.concluido
                    ]
                )
            }

            await conexao.commit()

            return id_registro

        } catch (err) {
            await conexao.rollback()
            throw err
        } finally {
            conexao.release()
        }
    }
    async verificarExerciciosDaFicha(id_ficha, exercicios) {
        const exercicioFichaModel = new ExercicioFichaModel()
        const exerciciosDaFicha = await exercicioFichaModel.listarPorCampo({
            id_ficha
        })
        const idsDaFicha = new Set(
            exerciciosDaFicha.map(exercicio =>
                Number(exercicio.id_exercicio)
            )
        )

        return exercicios.every(exercicio =>
            idsDaFicha.has(Number(exercicio.id_exercicio))
        )
    }
}

export default RegistroDeTreinoModel
