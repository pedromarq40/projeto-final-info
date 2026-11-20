import { useNavigate } from "react-router-dom"
import { useState } from "react"
import api from '../api/api.js'

export default function Login({ setUser }) {
  const navigate = useNavigate()

  const [role, setRole] = useState("aluno")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post(`${role === "aluno" ? "alunos" : "professores"}/login`, { email, senha })
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      alert("Login efetuado com sucesso!")
      navigate('/')
    } catch (error) {
      console.log(error.response?.status)
      console.log(error.response?.data)
      alert("Erro no login!")
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_3fr]">
      {/* Lado esquerdo */}
      <aside className="relative hidden items-center overflow-hidden bg-[#111310] p-8 lg:flex">
        <div className="relative">
          <div className="mb-8 text-6xl font-extrabold tracking-tight">
            <span className="text-[#a6ee1f]">PULSO</span>
            <span className="text-white">FIT</span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white">
            A sua jornada,
            <br />
            <span className="bg-gradient-to-r from-[#a6ee1f] to-[#5fd35f] bg-clip-text text-transparent">
              em sintonia.
            </span>
          </h1>
        </div>
      </aside>

      {/* Lado direito */}
      <main className="flex items-center justify-center bg-[#f3f5ef] px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-4xl font-bold tracking-tight text-[#111310]">
            Acesse a sua conta
          </h2>
          <p className="mt-2 text-sm text-[#111310]/50">
            Bem-vindo de volta.
          </p>

          {/* Perfil */}
          <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-[#e6eae0] p-1">
            {[
              ["aluno", "Aluno"],
              ["professor", "Professor"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`rounded-lg py-3 text-sm font-semibold ${
                  role === value
                    ? "bg-white text-[#111310] shadow-md"
                    : "text-[#111310]/50 hover:text-[#111310]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full rounded-xl border border-transparent bg-white px-4 py-4 text-sm text-[#111310] shadow-sm outline-none placeholder:text-[#111310]/40 focus:border-[#a6ee1f] focus:shadow-[0_0_0_4px_rgba(166,238,31,0.25)]"
            />

            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
              className="w-full rounded-xl border border-transparent bg-white px-4 py-4 text-sm text-[#111310] shadow-sm outline-none placeholder:text-[#111310]/40 focus:border-[#a6ee1f] focus:shadow-[0_0_0_4px_rgba(166,238,31,0.25)]"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#a6ee1f] py-4 text-sm font-bold text-[#111310] shadow-lg shadow-[#a6ee1f]/30"
          >
            Entrar
          </button>

          <p className="mt-6 text-center text-sm text-[#111310]/50">
            Não tem conta?{" "}
            <a
              href="/cadastro"
              className="font-semibold text-[#5a8a0f] hover:text-[#111310]"
            >
              Criar conta
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
