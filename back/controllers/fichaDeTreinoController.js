import BaseController from './baseController.js'
import FichaDeTreinoModel from '../models/fichaDeTreinoModel.js'

class FichaDeTreinoController extends BaseController {
    static {
        this.definirModel(new FichaDeTreinoModel())
    }

    static async buscarParaEdicao(req, res) {
        try {
            if (req.user.role !== 'professor') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para professores'
                })
            }

            const CPF = req.params.CPF
            const resultado = await this.model.buscarParaEdicao(CPF)

            if (!resultado) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            res.status(200).json(resultado)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async minhaFicha(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const ficha = await this.model.buscarFichaComExercicios(
                req.user.id
            )

            if (!ficha || ficha.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            res.status(200).json(ficha)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async criarFicha(req, res) {
        try {
            if (req.user.role !== 'professor') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para professores'
                })
            }

            const { CPF, foco, tipo, validade, exercicios } = req.body

            if (
                !CPF ||
                !foco ||
                !tipo ||
                !validade ||
                !Array.isArray(exercicios) ||
                exercicios.length === 0
            ) {
                return res.status(400).json({
                    error: 'Preencha os dados da ficha e adicione pelo menos um exercício'
                })
            }

            const ids = new Set()
            const ordens = new Set()
            const ordensInformadas = []

            for (const exercicio of exercicios) {
                if (
                    !Number.isInteger(exercicio.id_exercicio) ||
                    exercicio.id_exercicio < 1 ||
                    !Number.isInteger(exercicio.ordem) ||
                    exercicio.ordem < 1 ||
                    !Number.isInteger(exercicio.carga) ||
                    exercicio.carga < 0 ||
                    !Number.isInteger(exercicio.series) ||
                    exercicio.series < 1 ||
                    !Number.isInteger(exercicio.repeticoes) ||
                    exercicio.repeticoes < 1
                ) {
                    return res.status(400).json({
                        error: 'Informe exercício, carga, séries, repetições e ordem válidos'
                    })
                }

                if (ids.has(exercicio.id_exercicio)) {
                    return res.status(400).json({
                        error: 'Não é permitido adicionar o mesmo exercício mais de uma vez'
                    })
                }

                if (ordens.has(exercicio.ordem)) {
                    return res.status(400).json({
                        error: 'Não é permitido repetir a ordem dos exercícios'
                    })
                }

                ids.add(exercicio.id_exercicio)
                ordens.add(exercicio.ordem)
                ordensInformadas.push(exercicio.ordem)
            }

            ordensInformadas.sort((a, b) => a - b)

            for (let indice = 0; indice < ordensInformadas.length; indice += 1) {
                if (ordensInformadas[indice] !== indice + 1) {
                    return res.status(400).json({
                        error: 'A ordem dos exercícios deve começar em 1 e ser sequencial'
                    })
                }
            }

            const assinaturas = await this.model.buscarAssinaturaVigente(CPF)

            if (assinaturas.length === 0) {
                return res.status(409).json({
                    error: 'O aluno precisa ter uma assinatura vigente para receber uma ficha de treino'
                })
            }

            const resultado = await this.model.criarFichaComExercicios({
                CPF,
                foco,
                tipo,
                validade,
                exercicios
            })

            res.status(201).json({
                message: 'Ficha de treino criada com sucesso',
                id_ficha: resultado.id_ficha
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async atualizarFicha(req, res) {
        try {
            if (req.user.role !== 'professor') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para professores'
                })
            }

            const CPF = req.params.CPF
            const { foco, tipo, validade, exercicios } = req.body

            if (
                !foco ||
                !tipo ||
                !validade ||
                !Array.isArray(exercicios) ||
                exercicios.length === 0
            ) {
                return res.status(400).json({
                    error: 'Preencha os dados da ficha e adicione pelo menos um exercício'
                })
            }

            const ids = new Set()
            const ordens = new Set()
            const ordensInformadas = []

            for (const exercicio of exercicios) {
                if (
                    !Number.isInteger(exercicio.id_exercicio) ||
                    exercicio.id_exercicio < 1 ||
                    !Number.isInteger(exercicio.ordem) ||
                    exercicio.ordem < 1 ||
                    !Number.isInteger(exercicio.carga) ||
                    exercicio.carga < 0 ||
                    !Number.isInteger(exercicio.series) ||
                    exercicio.series < 1 ||
                    !Number.isInteger(exercicio.repeticoes) ||
                    exercicio.repeticoes < 1
                ) {
                    return res.status(400).json({
                        error: 'Informe exercício, carga, séries, repetições e ordem válidos'
                    })
                }

                if (ids.has(exercicio.id_exercicio)) {
                    return res.status(400).json({
                        error: 'Não é permitido adicionar o mesmo exercício mais de uma vez'
                    })
                }

                if (ordens.has(exercicio.ordem)) {
                    return res.status(400).json({
                        error: 'Não é permitido repetir a ordem dos exercícios'
                    })
                }

                ids.add(exercicio.id_exercicio)
                ordens.add(exercicio.ordem)
                ordensInformadas.push(exercicio.ordem)
            }

            ordensInformadas.sort((a, b) => a - b)

            for (let indice = 0; indice < ordensInformadas.length; indice += 1) {
                if (ordensInformadas[indice] !== indice + 1) {
                    return res.status(400).json({
                        error: 'A ordem dos exercícios deve começar em 1 e ser sequencial'
                    })
                }
            }

            const resultado = await this.model.atualizarFichaComExercicios(
                CPF,
                {
                    foco,
                    tipo,
                    validade,
                    exercicios
                }
            )

            res.status(200).json({
                message: 'Ficha de treino atualizada com sucesso',
                id_ficha: resultado.id_ficha
            })
        } catch (err) {
            if (err.message === 'Ficha de treino não encontrada') {
                return res.status(404).json({
                    error: err.message
                })
            }

            res.status(500).json({ error: err.message })
        }
    }
}

export default FichaDeTreinoController
