import BaseModel from './baseModel.js'

class PlanoModel extends BaseModel {
    constructor() {
        super('plano', [
            'id_plano',
            'valor_mensal',
            'nome',
            'efetivo'
        ])
    }

}

export default PlanoModel
