import BaseModel from './baseModel.js'

class ExercicioModel extends BaseModel {
    constructor() {
        super('exercicio', [
            'id_exercicio',
            'nome',
            'video'
        ])
    }

}

export default ExercicioModel
