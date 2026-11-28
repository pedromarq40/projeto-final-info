import Aside from "../../components/Aside.jsx"
import useRegistrosDeTreino from "../../hooks/useRegistrosDeTreino.js"
import {
  formatarDataTreino,
  formatarDuracao,
  duracaoEmSegundos,
} from "../../utils/treinos.js"

export default function HistoricoDeTreino({ user, setUser }) {
  const { registros, carregando, erro } = useRegistrosDeTreino()

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#111310] md:pb-0">
      <Aside user={user} setUser={setUser} />

      <main className="min-w-0 flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Histórico de treino</h1>
          <p className="mt-2 text-sm text-[#111310]/60">
            Consulte seus treinos registrados e os exercícios realizados.
          </p>

          {erro && (
            <p role="alert" className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">
              {erro}
            </p>
          )}

          {carregando ? (
            <p className="mt-8 text-gray-500">Carregando histórico...</p>
          ) : !erro && registros.length === 0 ? (
            <p className="mt-8 rounded-2xl bg-white p-6 text-gray-500 shadow-sm">
              Nenhum treino registrado ainda.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {registros.map((registro) => (
                <article
                  key={registro.id_registro}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold">
                        Treino de {formatarDataTreino(registro.data_registro)}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {registro.hora}
                      </p>
                    </div>
                    <p className="rounded-full bg-[#f3f5ef] px-3 py-1 text-sm font-semibold text-[#5a8a0f]">
                      {formatarDuracao(duracaoEmSegundos(registro.duracao))}
                    </p>
                  </div>

                  {registro.exercicios.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-500">
                      Nenhum exercício associado a este treino.
                    </p>
                  ) : (
                    <ol className="mt-4 space-y-3">
                      {registro.exercicios.map((exercicio) => (
                        <li
                          key={exercicio.id_exercicio}
                          className="flex items-start gap-3 rounded-xl border border-gray-100 p-4"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4f2cb] text-sm font-bold text-[#5a8a0f]">
                            {exercicio.ordem}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold">
                              {exercicio.exercicio}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {exercicio.carga} kg · {exercicio.series} séries ·{" "}
                              {exercicio.repeticoes} repetições
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-sm font-medium ${
                              exercicio.concluido
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {exercicio.concluido ? "Concluído" : "Não concluído"}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
