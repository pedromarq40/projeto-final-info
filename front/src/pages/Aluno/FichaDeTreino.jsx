import { useEffect, useState } from "react"
import api from "../../api/api.js"
import Aside from "../../components/Aside.jsx"

export default function FichaDeTreino({ user, setUser }) {
  const [ficha, setFicha] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarFicha() {
      try {
        const resposta = await api.get("/fichas-de-treino/minha-ficha")
        setFicha(resposta.data)
      } catch (error) {
        if (error.response?.status === 404) {
          setErro("Você ainda não possui uma ficha de treino.")
        } else {
          setErro("Erro ao carregar sua ficha de treino.")
        }
        console.log(error.response?.data)
      } finally {
        setCarregando(false)
      }
    }

    carregarFicha()
  }, [])

  const fichasAgrupadas = Object.values(
    ficha.reduce((grupos, item) => {
      if (!grupos[item.id_ficha]) {
        grupos[item.id_ficha] = {
          id_ficha: item.id_ficha,
          foco: item.foco,
          tipo: item.tipo,
          validade: item.validade,
          exercicios: [],
        }
      }

      if (item.id_exercicio) {
        grupos[item.id_ficha].exercicios.push(item)
      }

      return grupos
    }, {}),
  ).map((fichaAtual) => ({
    ...fichaAtual,
    exercicios: [...fichaAtual.exercicios].sort(
      (primeiro, segundo) => Number(primeiro.ordem) - Number(segundo.ordem),
    ),
  }))

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#111310] md:pb-0">
      <Aside user={user} setUser={setUser} />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Ficha de treino</h1>

          <p className="mt-2 text-sm text-[#111310]/60">
            Consulte seus exercícios e orientações de treino.
          </p>

          {carregando ? (
            <p className="mt-8">Carregando ficha...</p>
                    ) : erro ? (
            <p className="mt-8 rounded-xl bg-white p-6 shadow-sm">
              {erro}
            </p>
          ) : (
            fichasAgrupadas.map((fichaAtual) => (
              <div
                key={fichaAtual.id_ficha}
                className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">
                  Ficha {fichaAtual.id_ficha}
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">Foco</p>
                    <p className="font-semibold">{fichaAtual.foco}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <p className="font-semibold">{fichaAtual.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Validade</p>
                    <p className="font-semibold">
                      {fichaAtual.validade
                        ? new Date(fichaAtual.validade).toLocaleDateString("pt-BR")
                        : "Não informada"}
                    </p>
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-bold">Exercícios</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Realize todos os exercícios na ordem indicada.
                </p>

                <div className="mt-4 space-y-4">
                  {fichaAtual.exercicios.map((item) => (
                    <div
                      key={item.id_exercicio}
                      className="flex items-start gap-4 rounded-xl border border-gray-100 p-4"
                    >
                      <span
                        aria-label={`Exercício ${item.ordem}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a6ee1f] font-bold text-[#111310]"
                      >
                        {item.ordem}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold">{item.exercicio}</h4>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-sm text-gray-500">Séries</p>
                            <p className="font-semibold">{item.series}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Repetições</p>
                            <p className="font-semibold">{item.repeticoes}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Carga</p>
                            <p className="font-semibold">{item.carga} kg</p>
                          </div>
                        </div>
                        {item.video && (
                          <a
                            href={item.video}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
                          >
                            Ver vídeo do exercício
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
           
        </div>
      </main>
    </div>
  )
}
