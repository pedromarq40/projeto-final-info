import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { auth } from './auth/auth.js'
import endpoints from './routes/_nomesrotas.js'
import professorRouter from './routes/professorRoute.js'
import alunoRouter from './routes/alunoRoute.js'
import exercicioRouter from './routes/exercicioRoute.js'
import fichaDeTreinoRouter from './routes/fichaDeTreinoRoute.js'
import registroDeTreinoRouter from './routes/registroDeTreinoRoute.js'
import exercicioFichaRouter from './routes/exercicioFichaRoute.js'
import planoRouter from './routes/planoRoute.js'
import mensalidadeRouter from './routes/mensalidadeRoute.js'
import assinaturaRouter from './routes/assinaturaRoute.js'
import db from './sql/db.js'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/professores', professorRouter)
app.use('/alunos', alunoRouter)
app.use('/exercicios', exercicioRouter)
app.use('/fichas-de-treino', fichaDeTreinoRouter)
app.use('/registros-de-treino', registroDeTreinoRouter)
app.use('/exercicios-ficha', exercicioFichaRouter)
app.use('/planos', planoRouter)
app.use('/mensalidades', mensalidadeRouter)
app.use('/assinaturas', assinaturaRouter)

app.get('/auth/me', auth, async (req, res) => {
    try {
        const { id, role } = req.user

        const [rows] = await db.execute(
            `SELECT CPF, nome_completo, email, telefone FROM ${role} WHERE CPF = ?`,
            [id]
        )

        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Usuário não encontrado.'
            })
        }

        res.json({ user: { ...rows[0], role } })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Erro ao buscar usuário.'
        })
    }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log('\n', `Servidor rodando em http://localhost:${PORT}`, '\n')
    console.table(endpoints) 
    // print pra ajudar no debug, mostra as rotas

})
