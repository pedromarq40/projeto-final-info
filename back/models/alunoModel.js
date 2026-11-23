import BaseModel from './baseModel.js'
import bcrypt from 'bcrypt'

class AlunoModel extends BaseModel {
    constructor() {
        super('aluno', [
            'CPF',
            'altura',
            'peso',
            'problemas_saude',
            'email',
            'nome_completo',
            'telefone',
            'data_criacao',
            'senha'
        ])
        
    }

    async login(email, senha) {
        try {
            const [aluno] = await this.db.execute(
                "SELECT * FROM aluno WHERE email = ?", [email]
            )
            if (aluno.length === 0) {
                return null
            }

            const senhaValida = await bcrypt.compare(senha, aluno[0].senha)
            if (senhaValida) {
                return aluno[0]
            } else {
                return null
            }
        }catch(err) {
            throw new Error(`Erro ao realizar login: ${err.message}, ERRO NO ALUNOMODEL`)
        }
    }

    async hashPassword(senha){
        const senhaHash = await bcrypt.hash(senha, 10);
        return senhaHash
    }
    async atualizarDados(CPF, dados) {
    const camposPermitidos = [
        'nome_completo',
        'email',
        'telefone',
        'altura',
        'peso',
        'problemas_saude'
    ]

    const dadosFiltrados = {}

    for (const campo of camposPermitidos) {
        if (dados[campo] !== undefined) {
            dadosFiltrados[campo] = dados[campo]
        }
    }

    if (Object.keys(dadosFiltrados).length === 0) {
        throw new Error('Nenhum dado válido foi enviado')
    }

    return await this.atualizar(dadosFiltrados, { CPF })
}
}

export default AlunoModel
