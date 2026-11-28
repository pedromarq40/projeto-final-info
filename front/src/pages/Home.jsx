
import Aside from '../components/Aside.jsx'
import { Link } from 'react-router-dom'
import useRegistrosDeTreino from '../hooks/useRegistrosDeTreino.js'
import {
  calcularEstatisticasTreino,
  formatarDuracao,
} from '../utils/treinos.js'

export default function Home({ user, setUser }) {
  const { registros, carregando, erro } = useRegistrosDeTreino(
    user.role === "aluno",
  )
  const estatisticas = calcularEstatisticasTreino(registros)
  const primeiroNome = user.nome_completo?.split(" ")[0] || "Aluno"

  const iniciais = user.nome_completo
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("") || "AL"

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const secoesAluno = [
    {
      titulo: "Meus dados",
      descricao: "Consulte e atualize suas informações pessoais.",
      rota: "/aluno/meus-dados",
    },
    {
      titulo: "Ficha de treino",
      descricao: "Veja seus exercícios e orientações de treino.",
      rota: "/aluno/ficha-de-treino",
    },
    {
      titulo: "Registros de treino",
      descricao: "Cronometre e registre os exercícios de cada sessão.",
      rota: "/aluno/registros-de-treino",
    },
    {
      titulo: "Histórico de treino",
      descricao: "Revise seus treinos e exercícios já realizados.",
      rota: "/aluno/historico-de-treino",
    },
    {
      titulo: "Mensalidade",
      descricao: "Consulte suas cobranças e pagamentos.",
      rota: "/aluno/mensalidade",
    },
    {
      titulo: "Meu plano",
      descricao: "Confira sua assinatura e os planos disponíveis.",
      rota: "/aluno/plano",
    },
  ]

  const perfil = (
    <>
      <div className="text-right">
        <p className="text-sm font-bold">{user.nome_completo}</p>
        <p className="text-xs font-medium text-[#5a8a0f]">
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4f2cb] font-bold text-[#5a8a0f]">
        {iniciais}
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#172016] md:pb-0">
      <Aside user={user} setUser={setUser} />

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#172016]/10 bg-white px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs capitalize text-gray-500">{hoje}</p>
            <h1 className="text-xl font-bold">Início</h1>
          </div>

          {user.role === "aluno" ? (
            <Link
              to="/aluno/meus-dados"
              aria-label="Acessar meus dados"
              className="flex items-center gap-3 rounded-xl transition hover:bg-[#f3f5ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a8a0f]"
            >
              {perfil}
            </Link>
          ) : (
            <div className="flex items-center gap-3">{perfil}</div>
          )}
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <section className="relative min-h-[380px] overflow-hidden rounded-3xl bg-[#263b1c] p-8 text-white shadow-lg sm:flex sm:items-center sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#b9df7b]">
                PulsoFit • Sua academia
              </p>

              <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Olá, {primeiroNome}!
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                Bem-vindo ao PulsoFit. Aqui você pode acompanhar sua rotina
                de treinos, consultar suas informações e gerenciar sua
                experiência na academia.
              </p>
            </div>

            <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full border-[45px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-28 right-24 h-64 w-64 rounded-full bg-[#8fbd43]/20 blur-2xl" />

            <div className="pointer-events-none absolute bottom-8 right-10 hidden text-9xl font-black text-white/10 md:block">
              PF
            </div>
          </section>

          {user.role === "aluno" ? (
            <>
              <section className="mt-8" aria-labelledby="resumo-treino">
                <h2 id="resumo-treino" className="mb-4 text-xl font-bold">
                  Seu resumo de treino
                </h2>

                {erro ? (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
                  >
                    {erro}
                  </p>
                ) : carregando ? (
                  <p className="text-sm text-gray-500">
                    Carregando suas estatísticas...
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-2xl border border-[#dfe5d7] bg-white p-5">
                      <p className="text-sm font-medium text-gray-500">
                        Treinos registrados
                      </p>
                      <p className="mt-2 text-3xl font-bold">
                        {estatisticas.totalTreinos}
                      </p>
                    </article>
                    <article className="rounded-2xl border border-[#dfe5d7] bg-white p-5">
                      <p className="text-sm font-medium text-gray-500">
                        Tempo médio por treino
                      </p>
                      <p className="mt-2 text-3xl font-bold">
                        {estatisticas.duracaoMediaSegundos == null
                          ? "—"
                          : formatarDuracao(
                              estatisticas.duracaoMediaSegundos,
                            )}
                      </p>
                    </article>
                    <article className="rounded-2xl border border-[#dfe5d7] bg-white p-5">
                      <p className="text-sm font-medium text-gray-500">
                        Séries concluídas
                      </p>
                      <p className="mt-2 text-3xl font-bold">
                        {estatisticas.totalSeries}
                      </p>
                    </article>
                    <article className="rounded-2xl border border-[#dfe5d7] bg-white p-5">
                      <p className="text-sm font-medium text-gray-500">
                        Maior variação de carga
                      </p>
                      {estatisticas.variacaoDestaque ? (
                        <>
                          <p
                            className={`mt-2 text-2xl font-bold ${
                              estatisticas.variacaoDestaque.variacao < 0
                                ? "text-amber-700"
                                : "text-[#5a8a0f]"
                            }`}
                          >
                            {estatisticas.variacaoDestaque.variacao > 0
                              ? "+"
                              : ""}
                            {Number(
                              estatisticas.variacaoDestaque.variacao,
                            ).toLocaleString("pt-BR", {
                              maximumFractionDigits: 1,
                            })}{" "}
                            kg
                          </p>
                          <p className="mt-1 truncate text-sm text-gray-500">
                            {estatisticas.variacaoDestaque.exercicio}
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          Registre mais treinos para comparar.
                        </p>
                      )}
                    </article>
                  </div>
                )}
              </section>

              <Link
                to="/aluno/progresso"
                className="group mt-5 flex items-center justify-between gap-4 rounded-2xl bg-[#263b1c] p-6 text-white transition hover:bg-[#314c24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a8a0f]"
              >
                <span>
                  <span className="block text-lg font-bold">
                    Acompanhe seu progresso
                  </span>
                  <span className="mt-1 block text-sm text-white/70">
                    Veja como as cargas e seus treinos evoluíram ao longo do
                    tempo.
                  </span>
                </span>
                <span className="shrink-0 text-2xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <section className="mt-8" aria-labelledby="atalhos-aluno">
                <h2 id="atalhos-aluno" className="mb-4 text-xl font-bold">
                  Acesse suas áreas
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {secoesAluno.map((secao) => (
                    <Link
                      key={secao.rota}
                      to={secao.rota}
                      className="group rounded-2xl border border-[#dfe5d7] bg-white p-6 transition hover:-translate-y-1 hover:border-[#a6ee1f] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a8a0f]"
                    >
                      <span className="text-sm font-semibold text-[#5a8a0f]">
                        ÁREA DO ALUNO
                      </span>
                      <span className="mt-3 flex items-center justify-between gap-3 text-lg font-bold">
                        {secao.titulo}
                        <span className="text-[#5a8a0f] transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-gray-500">
                        {secao.descricao}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-[#dfe5d7] bg-white p-6">
              <p className="text-sm font-semibold text-[#5a8a0f]">
                SUA JORNADA COMEÇA AQUI
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Utilize o menu lateral para navegar pelo sistema.
              </p>
            </div>
          )}

          <footer className="mt-10 border-t border-[#172016]/10 pt-6 text-center text-xs text-gray-400">
            PulsoFit © {new Date().getFullYear()} • Gestão de academia
          </footer>
        </main>
      </div>
    </div>
  )
}
