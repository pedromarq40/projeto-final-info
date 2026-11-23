import BaseModel from './baseModel.js'

class ExercicioModel extends BaseModel {
    constructor() {
        super('exercicio', [
            'id_exercicio',
            'nome',
            'video'
        ])
    }

    async listarPaginado(pagina, limite, nome) {
        let filtroNome = ''
        let parametrosCount = []
        let parametrosConsulta = []

        if (nome) {
            filtroNome = ' WHERE nome LIKE ?'
            parametrosCount = [`%${nome}%`]
            parametrosConsulta = [`%${nome}%`, limite, (pagina - 1) * limite]
        } else {
            filtroNome = ''
            parametrosCount = []
            parametrosConsulta = [limite, (pagina - 1) * limite]
        }

        const [totalResultado] = await this.db.execute(
            `SELECT COUNT(*) AS total FROM exercicio${filtroNome}`,
            parametrosCount
        )

        const [exercicios] = await this.db.execute(
            `SELECT id_exercicio, nome, video
            FROM exercicio${filtroNome}
            ORDER BY id_exercicio ASC
            LIMIT ? OFFSET ?`,
            parametrosConsulta
        )

        const total = totalResultado[0].total

        return {
            dados: exercicios,
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite)
            }
        }


}

export default ExercicioModel
