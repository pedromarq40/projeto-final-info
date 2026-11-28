import { useEffect, useState } from "react"
import api from "../../api/api.js"
import Aside from "../../components/Aside.jsx"

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

function formatarMes(mes) {
  const [ano, numeroMes] = mes.split("-").map(Number)
  return new Date(ano, numeroMes - 1, 1).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  })
}

export default function Relatorios({ user, setUser }) {
  const [relatorios, setRelatorios] = useState(null)
  const [erro, setErro] = useState("")

  useEffect(() => {
    api.get("/admins/relatorios")
      .then(({ data }) => setRelatorios(data))
      .catch((error) => {
        setErro(error.response?.data?.error || "Não foi possível carregar os relatórios.")
      })
  }, [])

  const maiorFaturamento = Math.max(
    0,
    ...(relatorios?.faturamentoMensal || []).map((item) => Number(item.valor))
  )

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#172016] md:pb-0">
      <Aside user={user} setUser={setUser} />
      <div className="min-w-0 flex-1">
        <header className="border-b border-[#172016]/10 bg-white px-5 py-5 sm:px-8">
          <p className="text-xs text-gray-500">Painel administrativo</p>
          <h1 className="text-xl font-bold">Relatórios</h1>
        </header>

        <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-8 sm:py-10">
          {erro && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          {!relatorios && !erro && (
            <p className="text-sm text-gray-500">Carregando relatórios...</p>
          )}

          {relatorios && (
            <>
              <section className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-[#dfe5d7] bg-white p-6">
                  <p className="text-sm font-medium text-gray-500">Alunos cadastrados</p>
                  <p className="mt-3 text-3xl font-bold">{relatorios.totalAlunos}</p>
                </article>
                <article className="rounded-2xl border border-[#f1d7d4] bg-white p-6">
                  <p className="text-sm font-medium text-gray-500">Alunos com mensalidade atrasada</p>
                  <p className="mt-3 text-3xl font-bold text-red-700">
                    {relatorios.alunosAtrasados.length}
                  </p>
                </article>
              </section>

              <section className="rounded-2xl border border-[#dfe5d7] bg-white p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold">Faturamento mensal</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Valores recebidos nos últimos 12 meses.
                  </p>
                </div>
                {relatorios.faturamentoMensal.length === 0 ? (
                  <p className="text-sm text-gray-500">Ainda não há pagamentos registrados.</p>
                ) : (
                  <div className="space-y-4">
                    {relatorios.faturamentoMensal.map((item) => {
                      const valor = Number(item.valor)
                      const largura = maiorFaturamento > 0 ? (valor / maiorFaturamento) * 100 : 0
                      return (
                        <div key={item.mes} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-sm">
                          <span className="capitalize text-gray-500">{formatarMes(item.mes)}</span>
                          <div className="h-3 overflow-hidden rounded-full bg-[#edf0e9]">
                            <div
                              className="h-full rounded-full bg-[#8fbd43]"
                              style={{ width: `${largura}%` }}
                            />
                          </div>
                          <span className="min-w-24 text-right font-semibold">{moeda.format(valor)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-2xl border border-[#dfe5d7] bg-white">
                <div className="border-b border-[#dfe5d7] p-6">
                  <h2 className="text-lg font-bold">Mensalidades atrasadas</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {moeda.format(Number(relatorios.totalEmAtraso))} em valores vencidos.
                  </p>
                </div>
                {relatorios.alunosAtrasados.length === 0 ? (
                  <p className="p-6 text-sm text-gray-500">Nenhum aluno com mensalidade atrasada.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#f8faf5] text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-6 py-3">Aluno</th>
                          <th className="px-6 py-3">CPF</th>
                          <th className="px-6 py-3">Mensalidades</th>
                          <th className="px-6 py-3 text-right">Em atraso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edf0e9]">
                        {relatorios.alunosAtrasados.map((aluno) => (
                          <tr key={aluno.CPF}>
                            <td className="px-6 py-4 font-semibold">{aluno.nome_completo}</td>
                            <td className="px-6 py-4">{aluno.CPF}</td>
                            <td className="px-6 py-4">{aluno.mensalidades_atrasadas}</td>
                            <td className="px-6 py-4 text-right font-semibold">
                              {moeda.format(Number(aluno.valor_atrasado))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
