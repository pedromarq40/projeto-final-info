import BaseModel from './baseModel.js'

class RegistroDeTreinoModel extends BaseModel {
    constructor() {
        super('RegistroDeTreino', [
            'data_registro',
            'id_ficha',
            'hora',
            'duracao'
        ])
    }

}

export default RegistroDeTreinoModel
