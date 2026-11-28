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
import adminRouter from './routes/adminRoute.js'
import exercicioRouter from './routes/exercicioRoute.js'
import fichaDeTreinoRouter from './routes/fichaDeTreinoRoute.js'
import registroDeTreinoRouter from './routes/registroDeTreinoRoute.js'
import exercicioFichaRouter from './routes/exercicioFichaRoute.js'
import planoRouter from './routes/planoRoute.js'
import mensalidadeRouter from './routes/mensalidadeRoute.js'
import assinaturaRouter from './routes/assinaturaRoute.js'
import authRouter from './routes/authRoute.js'

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
app.use('/admins', adminRouter)
app.use('/exercicios', exercicioRouter)
app.use('/fichas-de-treino', fichaDeTreinoRouter)
app.use('/registros-de-treino', registroDeTreinoRouter)
app.use('/exercicios-ficha', exercicioFichaRouter)
app.use('/planos', planoRouter)
app.use('/mensalidades', mensalidadeRouter)
app.use('/assinaturas', assinaturaRouter)
app.use('/auth', authRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log('\n', `Servidor rodando em http://localhost:${PORT}`, '\n')
    //console.table(endpoints) 
    // print pra ajudar no debug, mostra as rotas

})
