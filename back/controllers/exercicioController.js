import BaseController from './baseController.js'
import ExercicioModel from '../models/exercicioModel.js'

class ExercicioController extends BaseController {
    static {
        this.definirModel(new ExercicioModel())
    }

    static async criar(req, res) {
        if (req.user.role !== 'professor') {
            return res.status(403).json({
                error: 'Acesso permitido somente para professores'
            })
        }

        const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : ''
        const video = typeof req.body.video === 'string' ? req.body.video.trim() : ''

        if (!nome || nome.length > 20 || video.length > 260) {
            return res.status(400).json({
                error: 'Informe um nome com até 20 caracteres e um vídeo com até 260 caracteres'
            })
        }

        if (video) {
            try {
                const url = new URL(video)
                if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
            } catch {
                return res.status(400).json({
                    error: 'Informe uma URL válida para o vídeo'
                })
            }
        }

        try {
            const [ids] = await this.model.db.execute(
                'SELECT COALESCE(MAX(id_exercicio), 0) + 1 AS id_exercicio FROM exercicio'
            )
            const id_exercicio = ids[0].id_exercicio

            await this.model.inserir({
                id_exercicio,
                nome,
                video: video || null
            })

            return res.status(201).json({
                message: 'Exercício cadastrado com sucesso',
                id_exercicio
            })
        } catch (err) {
            if (err.message.includes('Duplicate entry')) {
                return res.status(409).json({
                    error: 'Não foi possível gerar um identificador. Tente novamente.'
                })
            }

            return res.status(500).json({ error: err.message })
        }
    }

    static async atualizarExercicio(req, res) {
        if (req.user.role !== 'professor') {
            return res.status(403).json({
                error: 'Acesso permitido somente para professores'
            })
        }

        const id_exercicio = Number(req.params.id)
        const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : ''
        const video = typeof req.body.video === 'string' ? req.body.video.trim() : ''

        if (!Number.isInteger(id_exercicio) || id_exercicio < 1) {
            return res.status(400).json({ error: 'Identificador de exercício inválido' })
        }

        if (!nome || nome.length > 20 || video.length > 260) {
            return res.status(400).json({
                error: 'Informe um nome com até 20 caracteres e um vídeo com até 260 caracteres'
            })
        }

        if (video) {
            try {
                const url = new URL(video)
                if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
            } catch {
                return res.status(400).json({
                    error: 'Informe uma URL válida para o vídeo'
                })
            }
        }

        try {
            const [exercicios] = await this.model.db.execute(
                'SELECT id_exercicio FROM exercicio WHERE id_exercicio = ?',
                [id_exercicio]
            )

            if (exercicios.length === 0) {
                return res.status(404).json({ error: 'Exercício não encontrado' })
            }

            await this.model.atualizar(
                { nome, video: video || null },
                { id_exercicio }
            )

            return res.json({ message: 'Exercício atualizado com sucesso' })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }

    static async deletarExercicio(req, res) {
        if (req.user.role !== 'professor') {
            return res.status(403).json({
                error: 'Acesso permitido somente para professores'
            })
        }

        const id_exercicio = Number(req.params.id)
        if (!Number.isInteger(id_exercicio) || id_exercicio < 1) {
            return res.status(400).json({ error: 'Identificador de exercício inválido' })
        }

        try {
            const resultado = await this.model.deletar({ id_exercicio })

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: 'Exercício não encontrado' })
            }

            return res.json({ message: 'Exercício excluído com sucesso' })
        } catch (err) {
            if (err.message.includes('foreign key constraint fails')) {
                return res.status(409).json({
                    error: 'Este exercício está associado a uma ficha de treino e não pode ser excluído'
                })
            }

            return res.status(500).json({ error: err.message })
        }
    }
}

export default ExercicioController
