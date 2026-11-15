export default class BaseModel {

    #tabela
    #colunas
    constructor(tabela, colunas) {
        this.#tabela = tabela
        this.#colunas = colunas
    }
}