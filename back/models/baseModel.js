import db from '../sql/db.js'
export default class BaseModel {

    #tabela
    #colunas
    #db = db
    constructor(tabela, colunas) {
        this.#tabela = tabela // nome da tabela
        this.#colunas = colunas // lista das colunas da tabela
        this.#db = db 
    }

    get tabela() {
        return this.#tabela
    }
    
    get colunas() {
        return this.#colunas
    }

    get db() {
        return this.#db
    }

    tratarDados(dados) {
        const colunas = Object.keys(dados)
        const valores = Object.values(dados)
        
        return { colunas, valores }
    }

    async listarTodos(){
        try{
            const [linhas] = await this.#db.query(`SELECT * FROM ${this.tabela}`)
            return linhas
        }catch(err){
            throw new Error(`Erro ao listar todos os registros: ${err.message}`)
        }
    }

    async listarPorCampo(campofunc){
        const {campo, valor} = this.tratarDados(campofunc)
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

    async inserir(dadosfunc){
        const {colunas, valores} = this.tratarDados(dadosfunc)
        const str_colunas = colunas.join(', ')
        const str_valores = valores.map(() => '?').join(', ')
        try{
            const [resultado] = await this.#db.execute(
                `INSERT INTO ${this.tabela}(${str_colunas}) VALUES (${str_valores})`, valores
            )
            return resultado
        }catch(err){
            throw new rror(`Erro ao inserir registro: ${err.message}`)
        }
    }

    async atualizar(dadosfunc, campofunc){
        const {colunas, valores} = this.tratarDados(campofunc)
        const {campo_id, valor_id} = this.tratarDados(dadosfunc)
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

    async deletar(campofunc){
        const {campo, valor} = this.tratarDados(campofunc)
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

