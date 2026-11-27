import BaseModel from './baseModel.js'

class ExercicioRealizadoModel extends BaseModel {
    constructor() {
        super('ExercicioRealizado', [
            'id_registro',
            'id_exercicio',
            'carga_realizada',
            'series_realizadas',
            'repeticoes_realizadas',
            'concluido'
        ])
    }
}

export default ExercicioRealizadoModel