
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from './api/api.js'
import Protected from './components/Protected.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Home from './pages/Home.jsx'
import Alunos from './pages/professor/Alunos.jsx'
import Planos from './pages/professor/Planos.jsx'
import MeusDados from './pages/aluno/MeusDados.jsx'
import FichaDeTreino from './pages/aluno/FichaDeTreino.jsx'
import RegistrosDeTreino from './pages/aluno/RegistrosDeTreino.jsx'
import Mensalidade from './pages/aluno/Mensalidade.jsx'
import MeuPlano from './pages/aluno/MeuPlano.jsx'

export default function App() {
    const [user, setUser] = useState(undefined)

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => setUser(res.data.user))
            .catch(() => setUser(null))
    }, [])

    if (user === undefined) return null

    const isAuth = !!user

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Protected
                            children={<Home user={user} setUser={setUser} />}
                            condition={isAuth}
                            redirectTo="/login"
                        />
                    }
                />

                <Route
                    path="/cadastro"
                    element={<Protected children={<Cadastro />} condition={!isAuth} />}
                />

                <Route
                    path="/login"
                    element={
                        <Protected
                            children={<Login setUser={setUser} />}
                            condition={!isAuth}
                        />
                    }
                />

                <Route
                    path="/professor/alunos"
                    element={
                        <Protected
                            children={<Alunos user={user} setUser={setUser} />}
                            condition={isAuth && user.role === "professor"}
                        />
                    }
                />

                <Route
                    path="/professor/planos"
                    element={
                        <Protected
                            children={<Planos user={user} setUser={setUser} />}
                            condition={isAuth && user.role === "professor"}
                        />
                    }
                />

                <Route
                    path="/aluno/meus-dados"
                    element={
                        <Protected
                            children={<MeusDados user={user} setUser={setUser} />}
                            condition={isAuth && user.role === "aluno"}
                        />
                    }
                />

                <Route
                    path="/aluno/ficha-de-treino"
                    element={
                        <Protected
                            children={<FichaDeTreino user={user} setUser={setUser} />}
                            condition={isAuth && user.role === "aluno"}
                        />
                    }
                />

                <Route
                    path="/aluno/registros-de-treino"
                    element={
                        <Protected
                            children={<RegistrosDeTreino user={user} setUser={setUser} />}
                            condition={isAuth && user.role === "aluno"}
                        />
                    }
                />

                <Route
                    path="/aluno/mensalidade"
                    element={
                        <Protected
                            children={<Mensalidade user={user} setUser={setUser} />}
                            condition={isAuth && user.role === "aluno"}
                        />
                    }
                />

                <Route
                    path="/aluno/plano"
                    element={
                        <Protected
                            children={<MeuPlano user={user} setUser={setUser} />}
                            condition={isAuth && user.role === "aluno"}
                        />
                    }
                />

                <Route path="*" element={<NotFound user={user} />} />
            </Routes>
        </BrowserRouter>
    )
}
