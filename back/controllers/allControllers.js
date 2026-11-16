import BaseController from './baseController.js'
import {
    ProfessorModel,
    AlunoModel,
    ExercicioModel,
    FichaDeTreinoModel,
    RegistroDeTreinoModel,
    ExercicioFichaModel,
    PlanoModel,
    MensalidadeModel,
    AssinaturaModel
} from '../models/allModel.js'
import jwt from 'jsonwebtoken'

export class ProfessorController extends BaseController {
    static {
        this.definirModel(new ProfessorModel())
    }

    static async loginProfessor(req, res) {
        const { email, senha } = req.body
        try {
            const professor = await this.model.login(email, senha)
            if (professor) {
                const token = jwt.sign({ id: professor.CPF, role: "professor" }, process.env.JWT, { expiresIn: '1h' })
                res.status(200).cookie('token', token, 
                    { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 }
                ).json({mensagem: "Login Efetuado com Sucesso!"})
            } else {
                res.status(401).json({ error: 'Credenciais inválidas' })
            }
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
    /**
     * Insere um novo professor no banco de dados(cadastro).
     * Difere do inserir do baseModel porque salva a senha em hash.
     */
    static async inserir(req, res) {
        try {
            const dados = req.body
            dados['senha'] = await this.model.hashPassword(dados['senha'])
            const resultado = await this.model.inserir(dados)
            res.json({ message: 'Registro inserido com sucesso', id: resultado.insertId })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    } 

    static async logoutProfessor(req, res) {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' })
        res.status(200).json({ message: 'Logout realizado com sucesso' })
    }

}

export class AlunoController extends BaseController {
    static {
        this.definirModel(new AlunoModel())
    }

    static async loginAluno(req, res) {
        const { email, senha } = req.body
        try {
            const aluno = await this.model.login(email, senha)
            if (aluno) {
                const token = jwt.sign({ id: aluno.CPF, role: "aluno" }, process.env.JWT, { expiresIn: '1h' })
                res.status(200).cookie('token', token, 
                    { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 }
                ).json({mensagem: "Login Efetuado com Sucesso!"})
            } else {
                res.status(401).json({ error: 'Credenciais inválidas' })
            }
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async logoutAluno(req, res) {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' })
        res.status(200).json({ message: 'Logout realizado com sucesso' })
    }

    /**
     * Insere um novo aluno no banco de dados(cadastro).
     * Difere do inserir do baseModel porque salva a senha em hash.
     */
    static async inserir(req, res) {
        try {
            const dados = req.body
            dados['senha'] = await this.model.hashPassword(dados['senha'])
            const resultado = await this.model.inserir(dados)
            res.json({ message: 'Registro inserido com sucesso', id: resultado.insertId })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    } 

}

export class ExercicioController extends BaseController {
    static {
        this.definirModel(new ExercicioModel())
    }
}

export class FichaDeTreinoController extends BaseController {
    static {
        this.definirModel(new FichaDeTreinoModel())
    }
}

export class RegistroDeTreinoController extends BaseController {
    static {
        this.definirModel(new RegistroDeTreinoModel())
    }
}

export class ExercicioFichaController extends BaseController {
    static {
        this.definirModel(new ExercicioFichaModel())
    }
}

export class PlanoController extends BaseController {
    static {
        this.definirModel(new PlanoModel())
    }
}

export class MensalidadeController extends BaseController {
    static {
        this.definirModel(new MensalidadeModel())
    }
}

export class AssinaturaController extends BaseController {
    static {
        this.definirModel(new AssinaturaModel())
    }
}
