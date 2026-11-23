import BaseModel from './baseModel.js'
import bcrypt from 'bcrypt'

class ProfessorModel extends BaseModel {
    constructor() {
        super('professor', [
            'CPF',
            'email',
            'nome_completo',
            'telefone',
            'data_criacao',
            'senha',
            'especializacao'
        ])
    }

    async login(email, senha) {
        try {
            const [professor] = await this.db.execute(
                "SELECT * FROM professor WHERE email = ?", [email]
            )
            if (professor.length === 0) {
                return null
            }
            const senhaValida = await bcrypt.compare(senha, professor[0].senha)
            if (senhaValida) {
                return professor[0]
            } else {
                return null
            }
        }catch(err) {
            throw new Error(`Erro ao realizar login: ${err.message}`)
        }
    }

    async hashPassword(senha){
        const senhaHash = await bcrypt.hash(senha, 10);
        return senhaHash
    }
}

export default ProfessorModel
