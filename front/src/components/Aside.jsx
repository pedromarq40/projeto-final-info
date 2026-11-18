
import api from '../api/api.js'
import { useNavigate } from 'react-router-dom'

export default function Aside({ user, setUser }){
    const navigate = useNavigate()

    const menu = user.role === "aluno" ? 
        ["Início", "Ficha de treino", "Registros de treino", "Mensalidade", "Meu plano"]:
        ["Início", "Exercícios", "Planos", "Alunos"]
    
    const rotas = {
        "Início": "/", 
        "Ficha de treino": "/aluno/ficha-de-treino", 
        "Registros de treino": "/aluno/registros-de-treio",
        "Mensalidade": "/aluno/mensalidade",
        "Meu plano": "/aluno/plano",
        "Exercícios": "/professor/exercicios",
        "Planos": "/professor/planos",
        "Alunos": "/professor/alunos"
    }
    
    return(
      <aside className="hidden w-60 flex-col justify-between bg-[#111310] p-5 md:flex">
        <div>
          <div className="mb-10 text-lg font-extrabold tracking-tight">
            <span className="text-[#a6ee1f]">PULSO</span>
            <span className="text-white">FIT</span>
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Área da aluna
          </p>

          <nav className="space-y-1">
            {menu.map((item) => (
              <button
                key={item}
                onClick={() => navigate(rotas[item])}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm font-semibold 
                    text-white/50 hover:bg-white/5 hover:text-white`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={async () => {
            try {
              await api.post(`${user.role === "aluno" ? "alunos" : "professores"}/logout`)
            }
            finally {
              setUser(undefined)
              window.location.href = "/login";
            }
          }}
          className="px-3 py-3 text-left text-sm text-white/50 hover:text-white"
        >
          Sair
        </button>
      </aside>
    )
}