import express from 'express'
import morgan from 'morgan'
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(morgan('dev'))

const PORT  = process.env.PORT

app.get("/check", (req, res) => {
    res.status(200).json("Server rodando.")
})

app.listen(PORT, () => {
    console.log("\n", `Servidor rodando em http://localhost:${PORT}`, "\n")
})
