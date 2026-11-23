import BaseModel from './baseModel.js'
import FichaDeTreinoModel from './fichaDeTreinoModel.js'

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
            `SELECT data_registro, hora, duracao
             FROM RegistroDeTreino
             WHERE id_ficha = ?
             ORDER BY data_registro DESC`,
            [id_ficha]
        )
        return resultado
    }

}

export default RegistroDeTreinoModel
