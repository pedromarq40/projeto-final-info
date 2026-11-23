import BaseController from './baseController.js'
import PlanoModel from '../models/planoModel.js'

class PlanoController extends BaseController {
    static {
        this.definirModel(new PlanoModel())
    }

    static async atualizar(req, res) {
        try {
            const resultado = await this.model.atualizar(
                req.body,
                { id_plano: req.params.id }
            )

            res.json({
                message: 'Registro atualizado com sucesso',
                linhasAlteradas: resultado.affectedRows
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }

    }

    static async deletar(req, res) {
        try {
            const resultado = await this.model.atualizar(
                { efetivo: false },
                { id_plano: parseInt(req.params.id) }
            )

            res.json({
                message: 'Plano desativado com sucesso',
                linhasAlteradas: resultado.affectedRows
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export default PlanoController
