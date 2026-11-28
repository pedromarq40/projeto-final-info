import { useEffect, useState } from "react"
import api from "../../api/api.js"
import Aside from "../../components/Aside.jsx"

export default function RegistrosDeTreino({ user, setUser }) {
  const [exerciciosFicha, setExerciciosFicha] = useState([])
  const [exerciciosRealizados, setExerciciosRealizados] = useState([])
  const [inicioTreino, setInicioTreino] = useState(null)
  const [dataInicio, setDataInicio] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState("")

  function atualizarExercicio(index, campo, valor) {
    const novosExercicios = [...exerciciosRealizados]

    novosExercicios[index][campo] = valor

    setExerciciosRealizados(novosExercicios)
  }
  useEffect(() => {
    let ativo = true

    api
      .get("/fichas-de-treino/minha-ficha")
      .then(({ data }) => {
        if (!ativo) return

        const exercicios = data
          .filter((exercicio) => exercicio.id_exercicio)
          .sort(
            (primeiro, segundo) =>
              Number(primeiro.ordem) - Number(segundo.ordem),
          )

        setExerciciosFicha(exercicios)
        setExerciciosRealizados(
          exercicios.map((exercicio) => ({
            id_exercicio: exercicio.id_exercicio,
            carga_realizada: exercicio.carga,
            series_realizadas: exercicio.series,
            repeticoes_realizadas: exercicio.repeticoes,
            concluido: false,
          })),
        )
      })
      .catch((error) => {
        if (ativo) {
          setMensagem(
            error.response?.data?.error || "Erro ao carregar exercícios",
          )
        }
      })

    return () => {
      ativo = false
    }
  }, [])
  useEffect(() => {
    if (inicioTreino === null) return

    const intervalo = setInterval(() => {
      setTempoDecorrido(Date.now() - inicioTreino)
    }, 1000)

    return () => clearInterval(intervalo)
  }, [inicioTreino])

  function iniciarTreino() {
    const agora = new Date()

    const data = [
      agora.getFullYear(),
      String(agora.getMonth() + 1).padStart(2, "0"),
      String(agora.getDate()).padStart(2, "0"),
    ].join("-")

    const hora = [
      String(agora.getHours()).padStart(2, "0"),
      String(agora.getMinutes()).padStart(2, "0"),
      String(agora.getSeconds()).padStart(2, "0"),
    ].join(":")

    setDataInicio(data)
    setHoraInicio(hora)
    setTempoDecorrido(0)
    setInicioTreino(Date.now())
    setMensagem("")
  }

  function formatarTempo(tempo) {
    const segundosTotais = Math.floor(tempo / 1000)

    const horas = Math.floor(segundosTotais / 3600)
    const minutos = Math.floor((segundosTotais % 3600) / 60)
    const segundos = segundosTotais % 60

    return [horas, minutos, segundos]
      .map((valor) => String(valor).padStart(2, "0"))
      .join(":")
  }

  async function finalizarTreino() {
    if (inicioTreino === null || salvando) return
    const exerciciosInvalidos = exerciciosRealizados.some(
      (exercicio) =>
        exercicio.carga_realizada === "" ||
        exercicio.series_realizadas === "" ||
        exercicio.repeticoes_realizadas === "" ||
        Number(exercicio.carga_realizada) < 0 ||
        Number(exercicio.series_realizadas) <= 0 ||
        Number(exercicio.repeticoes_realizadas) <= 0,
    )

    if (exerciciosInvalidos) {
      setMensagem("Preencha corretamente os dados de todos os exercícios.")
      return
    }
    const duracao = formatarTempo(Date.now() - inicioTreino)

    setTempoDecorrido(Date.now() - inicioTreino)
    setInicioTreino(null)
    setSalvando(true)
    setMensagem("")

    try {
      await api.post("/registros-de-treino/registrar", {
        data_registro: dataInicio,
        hora: horaInicio,
        duracao,
        exercicios: exerciciosRealizados.map((exercicio) => ({
          id_exercicio: exercicio.id_exercicio,
          carga_realizada: Number(exercicio.carga_realizada),
          series_realizadas: Number(exercicio.series_realizadas),
          repeticoes_realizadas: Number(exercicio.repeticoes_realizadas),
          concluido: exercicio.concluido,
        })),
      })

      setMensagem("Treino registrado com sucesso!")
    } catch (err) {
      setMensagem(err.response?.data?.error || "Erro ao registrar treino")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#111310] md:pb-0">
      <Aside user={user} setUser={setUser} />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Meus registros de treino</h1>

          <p className="mt-2 text-sm text-[#111310]/60">
            Cronometre e registre os exercícios de cada sessão.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm text-center">
            <h2 className="text-xl font-bold">Cronômetro do treino</h2>

            <p className="my-8 text-5xl font-bold tabular-nums">
              {formatarTempo(tempoDecorrido)}
            </p>

            {inicioTreino === null ? (
              <button
                onClick={iniciarTreino}
                disabled={salvando}
                className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Iniciar treino"}
              </button>
            ) : (
              <button
                onClick={finalizarTreino}
                disabled={salvando}
                className="rounded-lg bg-red-600 px-8 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Finalizar treino
              </button>
            )}

            {mensagem && (
              <p
                className={`mt-5 text-sm font-medium ${
                  mensagem.includes("sucesso")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {mensagem}
              </p>
            )}
          </div>
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Exercícios do treino</h2>

            {exerciciosFicha.map((exercicio, index) => (
              <div
                key={exercicio.id_exercicio}
                className="mt-5 rounded-xl border border-gray-200 p-4"
              >
                <h3 className="font-bold">{exercicio.exercicio}</h3>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label>
                    Carga (kg)
                    <input
                      type="number"
                      min="0"
                      value={exerciciosRealizados[index]?.carga_realizada ?? ""}
                      onChange={(e) =>
                        atualizarExercicio(
                          index,
                          "carga_realizada",
                          e.target.value,
                        )
                      }
                      className="mt-1 w-full rounded-lg border p-2"
                    />
                  </label>

                  <label>
                    Séries
                    <input
                      type="number"
                      min="1"
                      value={
                        exerciciosRealizados[index]?.series_realizadas ?? ""
                      }
                      onChange={(e) =>
                        atualizarExercicio(
                          index,
                          "series_realizadas",
                          e.target.value,
                        )
                      }
                      className="mt-1 w-full rounded-lg border p-2"
                    />
                  </label>

                  <label>
                    Repetições
                    <input
                      type="number"
                      min="1"
                      value={
                        exerciciosRealizados[index]?.repeticoes_realizadas ?? ""
                      }
                      onChange={(e) =>
                        atualizarExercicio(
                          index,
                          "repeticoes_realizadas",
                          e.target.value,
                        )
                      }
                      className="mt-1 w-full rounded-lg border p-2"
                    />
                  </label>
                </div>

                <label className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exerciciosRealizados[index]?.concluido || false}
                    onChange={(e) =>
                      atualizarExercicio(index, "concluido", e.target.checked)
                    }
                  />
                  Exercício concluído
                </label>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
