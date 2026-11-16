import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import 'dotenv/config'
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

const app = express()
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.use('/professores', professorRouter)
app.use('/alunos', alunoRouter)
app.use('/exercicios', exercicioRouter)
app.use('/fichas-de-treino', fichaDeTreinoRouter)
app.use('/registros-de-treino', registroDeTreinoRouter)
app.use('/exercicios-ficha', exercicioFichaRouter)
app.use('/planos', planoRouter)
app.use('/mensalidades', mensalidadeRouter)
app.use('/assinaturas', assinaturaRouter)

app.get("/check", (req, res) => {
    res.status(200).json("Server rodando.")
})

const PORT  = process.env.PORT

app.listen(PORT, () => {
    console.log("\n", `Servidor rodando em http://localhost:${PORT}`, "\n")
    console.table(endpoints)
})
