import BaseModel from './baseModel.js'

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
            'nome'
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
