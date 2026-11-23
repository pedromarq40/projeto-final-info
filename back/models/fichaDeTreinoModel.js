import BaseModel from './baseModel.js'
import ExercicioFichaModel from './exercicioFichaModel.js'
import { readFile } from 'node:fs/promises'

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
            const buscarFichaComExerciciosQuery = await readFile(
                new URL('../sql/buscar_ficha_com_exercicios.sql', import.meta.url),
                'utf-8'
            )
            const [resultado] = await this.db.execute(
                buscarFichaComExerciciosQuery,
                [CPF]
            )

            return resultado
        } catch (err) {
            throw new Error(`Erro ao buscar ficha de treino: ${err.message}`)
        }
    }

    async criarFichaComExercicios(dados) {
        const { CPF, foco, tipo, validade, exercicios } = dados

        try {
            const fichasExistentes = await this.listarPorCampo({ CPF })

            if (fichasExistentes.length > 0) {
                throw new Error('Esse aluno já possui uma ficha de treino')
            }

            const [resultadoId] = await this.db.execute(
                'SELECT COALESCE(MAX(id_ficha), 0) + 1 AS novoId FROM FichaDeTreino'
            )

            const id_ficha = resultadoId[0].novoId

            await this.inserir({
                id_ficha,
                CPF,
                foco,
                tipo,
                validade
            })

            const exercicioFichaModel = new ExercicioFichaModel()

            for (const exercicio of exercicios) {
                await exercicioFichaModel.inserir({
                    id_exercicio: exercicio.id_exercicio,
                    id_ficha,
                    carga: exercicio.carga,
                    series: exercicio.series,
                    repeticoes: exercicio.repeticoes
                })
            }

            return { id_ficha }
        } catch (err) {
            throw new Error(`Erro ao criar ficha de treino: ${err.message}`)
        }
    }
}

export default FichaDeTreinoModel
