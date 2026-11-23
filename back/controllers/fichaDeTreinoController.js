import BaseController from './baseController.js'
import FichaDeTreinoModel from '../models/fichaDeTreinoModel.js'

class FichaDeTreinoController extends BaseController {
    static {
        this.definirModel(new FichaDeTreinoModel())
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

            const [assinaturas] = await this.model.db.execute(
                `SELECT id_assinatura
                 FROM assinatura
                 WHERE CPF = ? AND data_vencimento >= CURDATE()`,
                [CPF]
            )

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
}

export default FichaDeTreinoController
