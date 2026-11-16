export default class BaseController {
    
    static model

    static definirModel(model) {
        this.model = model
    }

    static async listarTodos(req, res) {
        try {
            const registros = await this.model.listarTodos()
            res.json(registros)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async listarPorCampo(req, res) {
        const campo = req.query // campo é tipo {id : 1} ou {nome: 'João'}
        try {
            const registros = await this.model.listarPorCampo(campo)
            res.json(registros)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async inserir(req, res) {
        const dados = req.body
        try {
            const resultado = await this.model.inserir(dados)
            res.json({ message: 'Registro inserido com sucesso', id: resultado.insertId })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async atualizar(req, res) {
        const campo = req.query
        const dados = req.body
        try {
            const resultado = await this.model.atualizar(dados, campo)
            res.json({ message: 'Registro atualizado com sucesso', linhasAlteradas: resultado.affectedRows })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async deletar(req, res) {
        const campo = req.query
        try {
            const resultado = await this.model.deletar(campo)
            res.json({ message: 'Registro deletado com sucesso', linhasAlteradas: resultado.affectedRows })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }   

}