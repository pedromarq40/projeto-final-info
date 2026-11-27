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
        const exercicioFichaModel = new ExercicioFichaModel()
        try {
          
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

            for (const exercicio of exercicios) {
                await exercicioFichaModel.inserir({
                    id_exercicio: exercicio.id_exercicio,
                    id_ficha,
                    carga: exercicio.carga,
                    series: exercicio.series,
                    repeticoes: exercicio.repeticoes,
                    ordem: exercicio.ordem
                })
            }

            return { id_ficha }
        } catch (err) {
            throw new Error(`Erro ao criar ficha de treino: ${err.message}`)
        }
    }

    async buscarAssinaturaVigente(CPF) {
        const [resultado] = await this.db.execute(
            `SELECT id_assinatura
             FROM assinatura
             WHERE CPF = ? AND data_vencimento >= CURDATE()`,
            [CPF]
        )
        return resultado
    }

    async buscarParaEdicao(CPF) {
        const fichas = await this.listarPorCampo({ CPF })

        if (fichas.length === 0) {
            return null
        }

        const [exercicios] = await this.db.execute(
            `SELECT ef.id_exercicio,
                    ef.carga,
                    ef.series,
                    ef.repeticoes,
                    ef.ordem,
                    e.nome
             FROM ExercicioFicha ef
             JOIN exercicio e ON e.id_exercicio = ef.id_exercicio
             WHERE ef.id_ficha = ?
             ORDER BY ef.ordem ASC`,
            [fichas[0].id_ficha]
        )

        return {
            ficha: fichas[0],
            exercicios
        }
    }

    async atualizarFichaComExercicios(CPF, dados) {
        const { foco, tipo, validade, exercicios } = dados
        const fichas = await this.listarPorCampo({ CPF })

        if (fichas.length === 0) {
            throw new Error('Ficha de treino não encontrada')
        }

        try {
            await this.atualizar(
                { foco, tipo, validade },
                { CPF }
            )

            const exercicioFichaModel = new ExercicioFichaModel()

            await exercicioFichaModel.deletar({
                id_ficha: fichas[0].id_ficha
            })

            for (const exercicio of exercicios) {
                await exercicioFichaModel.inserir({
                    id_exercicio: exercicio.id_exercicio,
                    id_ficha: fichas[0].id_ficha,
                    carga: exercicio.carga,
                    series: exercicio.series,
                    repeticoes: exercicio.repeticoes,
                    ordem: exercicio.ordem
                })
            }

            return { id_ficha: fichas[0].id_ficha }
        } catch (err) {
            throw err
        }
    }
}

export default FichaDeTreinoModel
