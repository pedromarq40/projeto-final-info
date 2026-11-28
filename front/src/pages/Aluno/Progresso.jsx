import Aside from "../../components/Aside.jsx"
import useRegistrosDeTreino from "../../hooks/useRegistrosDeTreino.js"
import {
  calcularEstatisticasTreino,
  formatarDataTreino,
  formatarDuracao,
} from "../../utils/treinos.js"

function formatarPeso(peso) {
  return `${Number(peso).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })} kg`
}

function formatarVariacao(variacao) {
  const sinal = variacao > 0 ? "+" : variacao < 0 ? "−" : ""
  return `${sinal}${formatarPeso(Math.abs(variacao))}`
}

export default function Progresso({ user, setUser }) {
  const { registros, carregando, erro } = useRegistrosDeTreino()
  const estatisticas = calcularEstatisticasTreino(registros)
  const evolucoesRepetidas = estatisticas.evolucao.filter(
    (item) => item.pontos.length > 1,
  )

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#111310] md:pb-0">
      <Aside user={user} setUser={setUser} />

      <main className="min-w-0 flex-1 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">Progresso</h1>
          <p className="mt-2 text-sm text-[#111310]/60">
            Acompanhe sua frequência, duração dos treinos e evolução das cargas.
          </p>

          {erro && (
            <p role="alert" className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">
              {erro}
            </p>
          )}

          {carregando ? (
            <p className="mt-8 text-gray-500">Carregando seus indicadores...</p>
          ) : !erro ? (
            <>
              <section
                className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                aria-label="Resumo do progresso"
              >
                <article className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Treinos registrados
                  </p>
                  <p className="mt-3 text-3xl font-bold">
                    {estatisticas.totalTreinos}
                  </p>
                </article>
                <article className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Duração média
                  </p>
                  <p className="mt-3 text-3xl font-bold">
                    {estatisticas.duracaoMediaSegundos == null
                      ? "—"
                      : formatarDuracao(estatisticas.duracaoMediaSegundos)}
                  </p>
                </article>
                <article className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Séries concluídas
                  </p>
                  <p className="mt-3 text-3xl font-bold">
                    {estatisticas.totalSeries}
                  </p>
                </article>
                <article className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Maior variação de carga
                  </p>
                  {estatisticas.variacaoDestaque ? (
                    <>
                      <p className="mt-3 text-2xl font-bold text-[#5a8a0f]">
                        {formatarVariacao(
                          estatisticas.variacaoDestaque.variacao,
                        )}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {estatisticas.variacaoDestaque.exercicio}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">
                      Registre mais treinos para comparar cargas.
                    </p>
                  )}
                </article>
              </section>

              <section className="mt-10" aria-labelledby="evolucao-cargas">
                <div className="mb-4">
                  <h2 id="evolucao-cargas" className="text-xl font-bold">
                    Evolução das cargas
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Cada barra compara a carga registrada para aquele exercício
                    ao longo dos treinos.
                  </p>
                </div>

                {evolucoesRepetidas.length === 0 ? (
                  <p className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm">
                    Ainda não há exercícios registrados em mais de um treino
                    para comparar.
                  </p>
                ) : (
                  <div className="grid gap-5 lg:grid-cols-2">
                    {evolucoesRepetidas.map((evolucao) => {
                      const maiorCarga = Math.max(
                        1,
                        ...evolucao.pontos.map((ponto) => ponto.carga),
                      )

                      return (
                        <article
                          key={evolucao.id_exercicio}
                          className="rounded-2xl bg-white p-6 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h3 className="text-lg font-bold">
                              {evolucao.exercicio}
                            </h3>
                            <span
                              className={`text-sm font-semibold ${
                                evolucao.variacao > 0
                                  ? "text-green-700"
                                  : evolucao.variacao < 0
                                    ? "text-amber-700"
                                    : "text-gray-500"
                              }`}
                            >
                              {formatarVariacao(evolucao.variacao)} desde o
                              primeiro registro
                            </span>
                          </div>

                          <div className="mt-5 space-y-4">
                            {evolucao.pontos.map((ponto) => (
                              <div
                                key={`${ponto.id_registro}-${ponto.data_registro}`}
                                className="grid grid-cols-[5rem_minmax(0,1fr)_4.5rem] items-center gap-3 text-sm"
                              >
                                <span className="text-gray-500">
                                  {formatarDataTreino(ponto.data_registro)}
                                </span>
                                <div
                                  role="img"
                                  aria-label={`${evolucao.exercicio}: ${formatarPeso(ponto.carga)}`}
                                  className="h-3 overflow-hidden rounded-full bg-[#eef1e8]"
                                >
                                  <div
                                    className="h-full rounded-full bg-[#a6ee1f]"
                                    style={{
                                      width: `${Math.max(
                                        4,
                                        (ponto.carga / maiorCarga) * 100,
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-right font-semibold">
                                  {formatarPeso(ponto.carga)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
