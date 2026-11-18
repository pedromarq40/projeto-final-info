import BaseModel from './baseModel.js'
import bcrypt from 'bcrypt'

export class ProfessorModel extends BaseModel {
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

export class AlunoModel extends BaseModel {
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
}

export class ExercicioModel extends BaseModel {
    constructor() {
        super('exercicio', [
            'id_exercicio',
            'nome',
            'video'
        ])
    }
}

export class FichaDeTreinoModel extends BaseModel {
    constructor() {
        super('FichaDeTreino', [
            'id_ficha',
            'CPF',
            'foco',
            'tipo',
            'validade'
        ])
    }
}

export class RegistroDeTreinoModel extends BaseModel {
    constructor() {
        super('RegistroDeTreino', [
            'data_registro',
            'id_ficha',
            'hora',
            'duracao'
        ])
    }
}

export class ExercicioFichaModel extends BaseModel {
    constructor() {
        super('ExercicioFicha', [
            'id_exercicio',
            'id_ficha',
            'carga',
            'series',
            'repeticoes'
        ])
    }
}

export class PlanoModel extends BaseModel {
    constructor() {
        super('plano', [
            'id_plano',
            'valor_mensal',
            'nome',
            'efetivo'
        ])
    }
}

export class MensalidadeModel extends BaseModel {
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

export class AssinaturaModel extends BaseModel {
    constructor() {
        super('assinatura', [
            'id_plano',
            'CPF',
            'data_assinatura',
            'data_vencimento'
        ])
    }
}
