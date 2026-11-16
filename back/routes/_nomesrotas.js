import expressListEndpoints from 'express-list-endpoints'
import professorRouter from './professorRoute.js'
import alunoRouter from './alunoRoute.js'
import exercicioRouter from './exercicioRoute.js'
import fichaDeTreinoRouter from './fichaDeTreinoRoute.js'
import registroDeTreinoRouter from './registroDeTreinoRoute.js'
import exercicioFichaRouter from './exercicioFichaRoute.js'
import planoRouter from './planoRoute.js'
import mensalidadeRouter from './mensalidadeRoute.js'
import assinaturaRouter from './assinaturaRoute.js'

const routers = [
        ['/professores', professorRouter],
        ['/alunos', alunoRouter],
        ['/exercicios', exercicioRouter],
        ['/fichas-de-treino', fichaDeTreinoRouter],
        ['/registros-de-treino', registroDeTreinoRouter],
        ['/exercicios-ficha', exercicioFichaRouter],
        ['/planos', planoRouter],
        ['/mensalidades', mensalidadeRouter],
        ['/assinaturas', assinaturaRouter]
    ]

    const endpoints = routers.flatMap(([prefix, router]) =>
        expressListEndpoints(router).flatMap(endpoint =>
            endpoint.methods.map(method => ({
                path: endpoint.path === '/' ? prefix : `${prefix}${endpoint.path}`,
                method,
                middlewares: endpoint.middlewares
            }))
        )
    )

    endpoints.push({
        path: '/check',
        method: 'GET',
        middlewares: ['anonymous']
    })

export default endpoints