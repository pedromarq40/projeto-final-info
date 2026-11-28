
import api from '../api/api.js'
import { useNavigate } from 'react-router-dom'

export default function Aside({ user, setUser }) {
    const navigate = useNavigate()

    const menu = user.role === "aluno" ?
        ["Início", "Meus dados", "Ficha de treino", "Registros de treino", "Histórico de treino", "Progresso", "Mensalidade", "Meu plano"] :
        user.role === "admin" ?
            ["Início", "Exercícios", "Planos", "Alunos", "Relatórios"] :
            ["Início", "Exercícios", "Planos", "Alunos"]

    const rotas = {
        "Início": "/",
        "Meus dados": "/aluno/meus-dados",
        "Ficha de treino": "/aluno/ficha-de-treino",
        "Registros de treino": "/aluno/registros-de-treino",
        "Histórico de treino": "/aluno/historico-de-treino",
        "Progresso": "/aluno/progresso",
        "Mensalidade": "/aluno/mensalidade",
        "Meu plano": "/aluno/plano",
        "Exercícios": "/professor/exercicios",
        "Planos": "/professor/planos",
        "Alunos": "/professor/alunos",
        "Relatórios": "/admin/relatorios"
    }

    return (
        <aside className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-start bg-[#111310] px-5 md:sticky md:inset-x-auto md:top-0 md:bottom-auto md:h-screen md:w-60 md:shrink-0 md:flex-col md:justify-between md:p-5">
            <div className="hidden md:block">
                <div className="mb-10 text-lg font-extrabold tracking-tight">
                    <span className="text-[#a6ee1f]">PULSO</span>
                    <span className="text-white">FIT</span>
                </div>

                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                    Área do {user.role}
                </p>

                <nav className="space-y-1">
                    {menu.map((item) => (
                        <button
                            key={item}
                            onClick={() => navigate(rotas[item])}
                            className="w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white"
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            <button
                onClick={async () => {
                    try {
                        const endpoint = user.role === "aluno" ? "alunos" : user.role === "admin" ? "admins" : "professores"
                        await api.post(`${endpoint}/logout`)
                    } finally {
                        setUser(undefined)
                        window.location.href = "/login"
                    }
                }}
                className="rounded-lg px-3 py-3 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
                Sair
            </button>
        </aside>
    )
}
