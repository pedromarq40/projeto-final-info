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
    async buscarFichaComExercicios(CPF) {
    try {
        const [resultado] = await this.db.execute(`
            SELECT
                f.id_ficha,
                f.foco,
                f.tipo,
                f.validade,
                e.id_exercicio,
                e.nome AS exercicio,
                e.video,
                ef.carga,
                ef.series,
                ef.repeticoes
            FROM FichaDeTreino f
            LEFT JOIN ExercicioFicha ef
                ON f.id_ficha = ef.id_ficha
            LEFT JOIN exercicio e
                ON ef.id_exercicio = e.id_exercicio
            WHERE f.CPF = ?
        `, [CPF])

        return resultado
    } catch (err) {
        throw new Error(`Erro ao buscar ficha de treino: ${err.message}`)
    }
}
async criarFichaComExercicios(dados) {
    const conexao = await this.db.getConnection()

    try {
        await conexao.beginTransaction()

        const { CPF, foco, tipo, validade, exercicios } = dados

        // Verifica se o aluno já possui uma ficha
        const [fichasExistentes] = await conexao.execute(
            'SELECT id_ficha FROM FichaDeTreino WHERE CPF = ?',
            [CPF]
        )

        if (fichasExistentes.length > 0) {
            throw new Error('Esse aluno já possui uma ficha de treino')
        }

        // Gera o próximo ID da ficha
        const [resultadoId] = await conexao.execute(
            'SELECT COALESCE(MAX(id_ficha), 0) + 1 AS novoId FROM FichaDeTreino'
        )

        const id_ficha = resultadoId[0].novoId

        // Cria a ficha
        await conexao.execute(
            `INSERT INTO FichaDeTreino
            (id_ficha, CPF, foco, tipo, validade)
            VALUES (?, ?, ?, ?, ?)`,
            [id_ficha, CPF, foco, tipo, validade]
        )

        // Vincula os exercícios à ficha
        for (const exercicio of exercicios) {
            await conexao.execute(
                `INSERT INTO ExercicioFicha
                (id_exercicio, id_ficha, carga, series, repeticoes)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    exercicio.id_exercicio,
                    id_ficha,
                    exercicio.carga,
                    exercicio.series,
                    exercicio.repeticoes
                ]
            )
        }

        await conexao.commit()

        return { id_ficha }

    } catch (err) {
        await conexao.rollback()
        throw new Error(`Erro ao criar ficha de treino: ${err.message}`)
    } finally {
        conexao.release()
    }
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
            'id_assinatura',
            'id_plano',
            'CPF',
            'data_assinatura',
            'data_vencimento'
        ])
    }
}