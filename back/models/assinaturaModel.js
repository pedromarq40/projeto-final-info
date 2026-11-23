import BaseModel from './baseModel.js'

class AssinaturaModel extends BaseModel {
    constructor() {
        super('assinatura', [
            'id_assinatura',
            'id_plano',
            'CPF',
            'data_assinatura',
            'data_vencimento'
        ])
    }

}

export default AssinaturaModel
