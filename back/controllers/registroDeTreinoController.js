import BaseController from './baseController.js'
import RegistroDeTreinoModel from '../models/registroDeTreinoModel.js'

class RegistroDeTreinoController extends BaseController {
    static {
        this.definirModel(new RegistroDeTreinoModel())
    }

    static async meusRegistros(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const fichas = await this.model.buscarFichaPorCpf(req.user.id)

            if (fichas.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            const registros = await this.model.buscarPorFicha(fichas[0].id_ficha)

            res.status(200).json(registros)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async registrar(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const { data_registro, hora, duracao, exercicios } = req.body

            if (
                !data_registro ||
                !hora ||
                !duracao ||
                !Array.isArray(exercicios) ||
                exercicios.length === 0
            ) {
                return res.status(400).json({
                    error: 'Preencha todos os campos'
                })
            }
            const exerciciosInvalidos = exercicios.some(exercicio =>
                !exercicio.id_exercicio ||
                exercicio.carga_realizada == null ||
                Number(exercicio.carga_realizada) < 0 ||
                !Number.isInteger(Number(exercicio.series_realizadas)) ||
                Number(exercicio.series_realizadas) <= 0 ||
                !Number.isInteger(Number(exercicio.repeticoes_realizadas)) ||
                Number(exercicio.repeticoes_realizadas) <= 0
            )

            if (exerciciosInvalidos) {
                return res.status(400).json({
                    error: 'Verifique os dados dos exercícios'
                })
            }
            const fichas = await this.model.buscarFichaPorCpf(req.user.id)

            if (fichas.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }
            const exerciciosPertencemAFicha =
                await this.model.verificarExerciciosDaFicha(
                    fichas[0].id_ficha,
                    exercicios
                )

            if (!exerciciosPertencemAFicha) {
                return res.status(400).json({
                    error: 'Um ou mais exercícios não pertencem à sua ficha'
                })
            }
            await this.model.inserirComExercicios(
                {
                    data_registro,
                    id_ficha: fichas[0].id_ficha,
                    hora,
                    duracao
                },
                exercicios
            )

            res.status(201).json({
                message: 'Treino registrado com sucesso'
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export default RegistroDeTreinoController
