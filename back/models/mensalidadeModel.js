import BaseModel from './baseModel.js'

class MensalidadeModel extends BaseModel {
    constructor() {
        super('mensalidade', [
            'data_geracao',
            'CPF',
            'id_plano',
            'valor',
            'vencimento',
            'data_pagamento'
        ])
    }

}

export default MensalidadeModel
