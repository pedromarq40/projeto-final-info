import BaseController from './baseController.js'
import ExercicioFichaModel from '../models/exercicioFichaModel.js'

class ExercicioFichaController extends BaseController {
    static {
        this.definirModel(new ExercicioFichaModel())
    }

}

export default ExercicioFichaController
