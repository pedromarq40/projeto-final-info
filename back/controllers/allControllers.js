
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
                const token = jwt.sign(
                    { id: professor.CPF, role: "professor" },
                    process.env.JWT,
                    { expiresIn: '1h' }
                )

                res.status(200).cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600000
                }).json({ mensagem: "Login Efetuado com Sucesso!" })

            } else {
                res.status(401).json({ error: 'Credenciais inválidas' })
            }
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async inserir(req, res) {
        try {
            const dados = req.body
            dados.senha = await this.model.hashPassword(dados.senha)

            const resultado = await this.model.inserir(dados)

            res.json({
                message: 'Registro inserido com sucesso',
                id: resultado.insertId
            })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async logoutProfessor(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.status(200).json({
            message: 'Logout realizado com sucesso'
        })
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
                const token = jwt.sign(
                    { id: aluno.CPF, role: "aluno" },
                    process.env.JWT,
                    { expiresIn: '1h' }
                )

                res.status(200).cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600000
                }).json({ mensagem: "Login Efetuado com Sucesso!" })

            } else {
                res.status(401).json({ error: 'Credenciais inválidas' })
            }
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async logoutAluno(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.status(200).json({
            message: 'Logout realizado com sucesso'
        })
    }

    static async inserir(req, res) {
        try {
            const dados = req.body
            dados.senha = await this.model.hashPassword(dados.senha)

            const resultado = await this.model.inserir(dados)

            res.json({
                message: 'Registro inserido com sucesso',
                id: resultado.insertId
            })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async meusDados(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const alunos = await this.model.listarPorCampo({
                CPF: req.user.id
            })

            if (!alunos || alunos.length === 0) {
                return res.status(404).json({
                    error: 'Aluno não encontrado'
                })
            }

            const { senha, ...dados } = alunos[0]

            res.json(dados)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async atualizarDados(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const resultado = await this.model.atualizarDados(
                req.user.id,
                req.body
            )

            res.status(200).json({
                message: 'Dados atualizados com sucesso',
                linhasAlteradas: resultado.affectedRows
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
    static async deletar(req, res) {
    try {
        if (req.user.role !== 'aluno') {
            return res.status(403).json({
                error: 'Acesso permitido somente para alunos'
            })
        }

        const resultado = await this.model.deletar({
            CPF: req.user.id
        })

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: 'Aluno não encontrado'
            })
        }

        res.status(200).json({
            message: 'Conta excluída com sucesso'
        })

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
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

    static async minhaFicha(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const ficha = await this.model.buscarFichaComExercicios(
                req.user.id
            )

            if (!ficha || ficha.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            res.status(200).json(ficha)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async criarFicha(req, res) {
        try {
            if (req.user.role !== 'professor') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para professores'
                })
            }

            const { CPF, foco, tipo, validade, exercicios } = req.body

            if (
                !CPF ||
                !foco ||
                !tipo ||
                !validade ||
                !Array.isArray(exercicios) ||
                exercicios.length === 0
            ) {
                return res.status(400).json({
                    error: 'Preencha os dados da ficha e adicione pelo menos um exercício'
                })
            }

            const resultado = await this.model.criarFichaComExercicios({
                CPF,
                foco,
                tipo,
                validade,
                exercicios
            })

            res.status(201).json({
                message: 'Ficha de treino criada com sucesso',
                id_ficha: resultado.id_ficha
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export class RegistroDeTreinoController extends BaseController {
    static {
        this.definirModel(new RegistroDeTreinoModel())
    }

    static async meusRegistros(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const [fichas] = await this.model.db.execute(
                'SELECT id_ficha FROM FichaDeTreino WHERE CPF = ?',
                [req.user.id]
            )

            if (fichas.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            const [registros] = await this.model.db.execute(
                `SELECT data_registro, hora, duracao
                 FROM RegistroDeTreino
                 WHERE id_ficha = ?
                 ORDER BY data_registro DESC`,
                [fichas[0].id_ficha]
            )

            res.status(200).json(registros)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async registrar(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso permitido somente para alunos'
                })
            }

            const { data_registro, hora, duracao } = req.body

            if (!data_registro || !hora || !duracao) {
                return res.status(400).json({
                    error: 'Preencha todos os campos'
                })
            }

            const [fichas] = await this.model.db.execute(
                'SELECT id_ficha FROM FichaDeTreino WHERE CPF = ?',
                [req.user.id]
            )

            if (fichas.length === 0) {
                return res.status(404).json({
                    error: 'Ficha de treino não encontrada'
                })
            }

            await this.model.inserir({
                data_registro,
                id_ficha: fichas[0].id_ficha,
                hora,
                duracao
            })

            res.status(201).json({
                message: 'Treino registrado com sucesso'
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
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

    static async atualizar(req, res) {
        try {
            const resultado = await this.model.atualizar(
                req.body,
                { id_plano: req.params.id }
            )

            res.json({
                message: 'Registro atualizado com sucesso',
                linhasAlteradas: resultado.affectedRows
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async deletar(req, res) {
        try {
            const resultado = await this.model.atualizar(
                { efetivo: false },
                { id_plano: parseInt(req.params.id) }
            )

            res.json({
                message: 'Plano desativado com sucesso',
                linhasAlteradas: resultado.affectedRows
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export class MensalidadeController extends BaseController {
    static {
        this.definirModel(new MensalidadeModel())
    }

    static async minhasMensalidades(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso somente para alunos'
                })
            }

            const [mensalidades] = await this.model.db.execute(
                `SELECT m.*, p.nome AS plano
                 FROM mensalidade m
                 JOIN plano p ON p.id_plano = m.id_plano
                 WHERE m.CPF = ?
                 ORDER BY m.vencimento DESC`,
                [req.user.id]
            )

            res.json(mensalidades)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async pagar(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso somente para alunos'
                })
            }

            const { data_geracao, id_plano } = req.body

            if (!data_geracao || !id_plano) {
                return res.status(400).json({
                    error: 'Informe a mensalidade que deseja pagar'
                })
            }

            const [resultado] = await this.model.db.execute(
                `UPDATE mensalidade
                 SET data_pagamento = CURDATE()
                 WHERE CPF = ?
                 AND data_geracao = ?
                 AND id_plano = ?
                 AND data_pagamento IS NULL`,
                [req.user.id, data_geracao, id_plano]
            )

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Mensalidade não encontrada ou já paga'
                })
            }

            res.json({
                message: 'Pagamento registrado com sucesso'
            })

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export class AssinaturaController extends BaseController {
    static {
        this.definirModel(new AssinaturaModel())
    }

    static async minhaAssinatura(req, res) {
        try {
            if (req.user.role !== 'aluno') {
                return res.status(403).json({
                    error: 'Acesso somente para alunos'
                })
            }

            const [assinatura] = await this.model.db.execute(
                `SELECT a.*, p.nome, p.valor_mensal
                 FROM assinatura a
                 JOIN plano p ON p.id_plano = a.id_plano
                 WHERE a.CPF = ?`,
                [req.user.id]
            )

            res.json(assinatura)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

   
static async trocar(req, res) {
    try {
        if (req.user.role !== 'aluno') {
            return res.status(403).json({
                error: 'Acesso somente para alunos'
            })
        }

        const id_plano = Number(req.body.id_plano)

        if (!id_plano) {
            return res.status(400).json({
                error: 'Selecione um plano'
            })
        }

        const [planos] = await this.model.db.execute(
            `SELECT id_plano, valor_mensal
             FROM plano
             WHERE id_plano = ? AND efetivo = TRUE`,
            [id_plano]
        )

        if (planos.length === 0) {
            return res.status(404).json({
                error: 'Plano não encontrado'
            })
        }

        const [atual] = await this.model.db.execute(
            'SELECT id_assinatura FROM assinatura WHERE CPF = ?',
            [req.user.id]
        )

        if (atual.length > 0) {
            await this.model.db.execute(
                `UPDATE assinatura
                 SET id_plano = ?
                 WHERE CPF = ?`,
                [id_plano, req.user.id]
            )
        } else {
            await this.model.db.execute(
                `INSERT INTO assinatura
                 (id_plano, CPF, data_assinatura, data_vencimento)
                 VALUES (?, ?, CURDATE(),
                 DATE_ADD(CURDATE(), INTERVAL 1 MONTH))`,
                [id_plano, req.user.id]
            )
        }

        const [assinaturas] = await this.model.db.execute(
            `SELECT data_vencimento
             FROM assinatura
             WHERE CPF = ?`,
            [req.user.id]
        )

        await this.model.db.execute(
            `INSERT IGNORE INTO mensalidade
             (data_geracao, CPF, id_plano, valor, vencimento, data_pagamento)
             VALUES (CURDATE(), ?, ?, ?, ?, NULL)`,
            [
                req.user.id,
                id_plano,
                planos[0].valor_mensal,
                assinaturas[0].data_vencimento
            ]
        )

        return res.json({
            message: 'Assinatura e mensalidade cadastradas com sucesso'
        })
    
    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

}
