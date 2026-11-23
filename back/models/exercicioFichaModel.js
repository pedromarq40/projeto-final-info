import BaseModel from './baseModel.js'

class ExercicioFichaModel extends BaseModel {
    constructor() {
        super('ExercicioFicha', [
            'id_exercicio',
            'id_ficha',
            'carga',
            'series',
            'repeticoes',
            'ordem'
        ])
    }

}

export default ExercicioFichaModel
