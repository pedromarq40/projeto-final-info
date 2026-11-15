import db from '../db.js'
export default class BaseModel {

    #tabela
    #colunas
    static #db = db
    constructor(tabela, colunas) {
        this.#tabela = tabela
        this.#colunas = colunas
        BaseModel.#db = db
    }

    get tabela() {
        return this.#tabela
    }
    
    get colunas() {
        return this.#colunas
    }

    static #tratarDados(dados) {
        const colunas = Object.keys(dados)
        const valores = Object.values(dados)
        
        return { colunas, valores }
    }

    static async listarTodos(){
        try{
            const [linhas] = await this.#db.query(`SELECT * FROM ${this.tabela}`)
            return linhas
        }catch(err){
            throw new Error(`Erro ao listar todos os registros: ${err.message}`)
        }
    }

    static async listarPorCampo(campo){
        const {campo, valor} = this.#tratarDados(campo)
        // campo é tipo {id : 1} ou {nome: 'João'}
        try{
            const [linhas] = await this.#db.execute(`SELECT * FROM ${this.tabela} WHERE ${campo} = ?`
                ,valor
            )
                return linhas
        }catch(error){
            throw new Error(`Erro ao listar todos os registros: ${err.message}`)
        }
    }

    static async inserir(dados){
        const {colunas, valores} = this.#tratarDados(dados)
        const str_colunas = colunas.join(', ')
        const str_valores = valores.map(() => '?').join(', ')
        try{
            const [resultado] = await this.#db.execute(
                `INSERT INTO ${this.tabela}(${str_colunas}) VALUES (${str_valores})`, valores
            )
            return resultado
        }catch(err){
            throw error(`Erro ao inserir registro: ${err.message}`)
        }
    }

    static async atualizar(dados, campo){
        const {colunas, valores} = this.#tratarDados(campo)
        const {campo_id, valor_id} = this.#tratarDados(dados)
        const str_colunas = colunas.map(coluna => `${coluna} = ?`).join(', ')
        try{
            const [resultado] = await this.#db.execute(
                `UPDATE ${this.tabela} SET ${str_colunas} WHERE ${campo_id} = ?`,
                ...valores, valor_id
            )
            return resultado
        }catch(err){
            throw new Error(`Erro ao atualizar registro: ${err.message}`)
        }
    }

    static async deletar(campo){
        const {campo, valor} = this.#tratarDados(campo)
        try{
            const [resultado] = await this.#db.execute(
                `DELETE FROM ${this.tabela} WHERE ${campo} = ?`, valor
            )
            return resultado
        }catch(err){
            throw new Error(`Erro ao deletar registro: ${err.message}`)
        }
    }   
}

