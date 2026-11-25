import BaseModel from './baseModel.js'
import bcrypt from 'bcrypt'
import { readFile } from 'node:fs/promises'

const alunosDevedoresQuerys = await readFile(
    new URL('../sql/buscar_alunos_devedores.sql', import.meta.url),
    'utf-8'
)

const faturamentoMensalQuery = await readFile(
    new URL('../sql/buscar_faturamento_mensal.sql', import.meta.url),
    'utf-8'
)
const qtdMensalidadesAtrasadasQuery = await readFile(
    new URL('../sql/buscar_qtd_mensalidades_atrasadas.sql', import.meta.url),
    'utf-8'
)


class AdminModel extends BaseModel {
    constructor() {
        super('admin', ['CPF', 'email', 'senha'])
    }

    async login(email, senha) {
        try {
            const [admins] = await this.db.execute(
                'SELECT * FROM admin WHERE email = ?', [email]
            )
            if (admins.length === 0) {
                return null
            }

            const senhaValida = await bcrypt.compare(senha, admins[0].senha)
            return senhaValida ? admins[0] : null
        } catch (err) {
            throw new Error(`Erro ao realizar login: ${err.message}`)
        }
    }

    async hashPassword(senha) {
        return await bcrypt.hash(senha, 10)
    }

    async obterRelatorios() {
        const [alunos] = await this.db.execute(
            'SELECT COUNT(*) AS totalAlunos FROM aluno'
        )
        const [alunosAtrasados] = await this.db.execute(alunosDevedoresQuerys)
        const [faturamentoMensal] = await this.db.execute(faturamentoMensalQuery)
        const [atraso] = await this.db.execute(qtdMensalidadesAtrasadasQuery)

        return {
            totalAlunos: alunos[0].totalAlunos,
            alunosAtrasados,
            totalEmAtraso: atraso[0].totalEmAtraso,
            faturamentoMensal
        }
    }
}

export default AdminModel
