import BaseController from './baseController.js'
import AssinaturaModel from '../models/assinaturaModel.js'

class AssinaturaController extends BaseController {
    static {
        this.definirModel(new AssinaturaModel())
    }

    static async minhaAssinatura(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso somente para alunos'
                })
            }

            const assinatura = await this.model.buscarMinha(req.user.id)

            res.json(assinatura)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async assinaturasAtivasDosAlunos(req, res) {
        try {
            if (!['professor', 'admin'].includes(req.user.role)) {
                return res.status(403).json({
                    error: 'Acesso permitido somente para professores e administradores'
                })
            }

            const assinaturas = await this.model.listarAtivasDosAlunos()
            return res.json(assinaturas)
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }

    static async trocar(req, res) {
        if (req.user.role !== 'aluno') {
            return res.status(403).json({
                error: 'Acesso somente para alunos'
            })
        }

        const id_plano = Number(req.body.id_plano)
        const duracao_meses = Number(req.body.duracao_meses)

        if (!Number.isInteger(id_plano) || id_plano < 1) {
            return res.status(400).json({
                error: 'Selecione um plano'
            })
        }

        if (!Number.isInteger(duracao_meses) || duracao_meses < 1 || duracao_meses > 24) {
            return res.status(400).json({
                error: 'A duração deve ser de 1 a 24 meses'
            })
        }

        try {
            const resultado = await this.model.trocar(
                req.user.id,
                id_plano,
                duracao_meses
            )

            if (resultado.status === 404) {
                return res.status(404).json({
                    error: 'Plano não encontrado'
                })
            }

            if (resultado.status === 409) {
                return res.status(409).json({
                    error: 'Você já possui uma assinatura vigente'
                })
            }

            return res.status(201).json({
                message: 'Assinatura e mensalidades cadastradas com sucesso',
                duracao_meses: resultado.duracao_meses
            })
        } catch (err) {
            return res.status(500).json({
                error: err.message
            })
        }
    }

}

export default AssinaturaController
