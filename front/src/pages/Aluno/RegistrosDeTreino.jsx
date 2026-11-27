import { useEffect, useState } from "react";
import api from "../../api/api.js";
import Aside from "../../components/Aside.jsx";

export default function RegistrosDeTreino({ user, setUser }) {
  const [registros, setRegistros] = useState([]);
  const [exerciciosFicha, setExerciciosFicha] = useState([]);
  const [exerciciosRealizados, setExerciciosRealizados] = useState([]);
  const [inicioTreino, setInicioTreino] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function carregarRegistros() {
    try {
      const resposta = await api.get("/registros-de-treino/meus-registros");

      const registrosAgrupados = resposta.data.reduce((acumulado, item) => {
        let registro = acumulado.find(
          (r) => r.id_registro === item.id_registro,
        );

        if (!registro) {
          registro = {
            id_registro: item.id_registro,
            data_registro: item.data_registro,
            hora: item.hora,
            duracao: item.duracao,
            exercicios: [],
          };

          acumulado.push(registro);
        }

        if (item.exercicio) {
          registro.exercicios.push({
            exercicio: item.exercicio,
            carga: item.carga_realizada,
            series: item.series_realizadas,
            repeticoes: item.repeticoes_realizadas,
            concluido: item.concluido,
          });
        }

        return acumulado;
      }, []);

      setRegistros(
        registrosAgrupados.filter((registro) => registro.exercicios.length > 0),
      );
    } catch (err) {
      setMensagem(err.response?.data?.error || "Erro ao carregar registros");
    }
  }

  async function carregarExercicios() {
    try {
      const resposta = await api.get("/fichas-de-treino/minha-ficha");

      const exercicios = resposta.data.filter(
        (exercicio) => exercicio.id_exercicio,
      );

      setExerciciosFicha(exercicios);

      setExerciciosRealizados(
        exercicios.map((exercicio) => ({
          id_exercicio: exercicio.id_exercicio,
          carga_realizada: exercicio.carga,
          series_realizadas: exercicio.series,
          repeticoes_realizadas: exercicio.repeticoes,
          concluido: false,
        })),
      );
    } catch (err) {
      setMensagem(err.response?.data?.error || "Erro ao carregar exercícios");
    }
  }
  function atualizarExercicio(index, campo, valor) {
    const novosExercicios = [...exerciciosRealizados];

    novosExercicios[index][campo] = valor;

    setExerciciosRealizados(novosExercicios);
  }
  useEffect(() => {
    carregarRegistros();
    carregarExercicios();
  }, []);
  useEffect(() => {
    if (inicioTreino === null) return;

    const intervalo = setInterval(() => {
      setTempoDecorrido(Date.now() - inicioTreino);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [inicioTreino]);

  function iniciarTreino() {
    const agora = new Date();

    const data = [
      agora.getFullYear(),
      String(agora.getMonth() + 1).padStart(2, "0"),
      String(agora.getDate()).padStart(2, "0"),
    ].join("-");

    const hora = [
      String(agora.getHours()).padStart(2, "0"),
      String(agora.getMinutes()).padStart(2, "0"),
      String(agora.getSeconds()).padStart(2, "0"),
    ].join(":");

    setDataInicio(data);
    setHoraInicio(hora);
    setTempoDecorrido(0);
    setInicioTreino(Date.now());
    setMensagem("");
  }

  function formatarTempo(tempo) {
    const segundosTotais = Math.floor(tempo / 1000);

    const horas = Math.floor(segundosTotais / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = segundosTotais % 60;

    return [horas, minutos, segundos]
      .map((valor) => String(valor).padStart(2, "0"))
      .join(":");
  }

  async function finalizarTreino() {
    if (inicioTreino === null || salvando) return;
    const exerciciosInvalidos = exerciciosRealizados.some(
      (exercicio) =>
        exercicio.carga_realizada === "" ||
        exercicio.series_realizadas === "" ||
        exercicio.repeticoes_realizadas === "" ||
        Number(exercicio.carga_realizada) < 0 ||
        Number(exercicio.series_realizadas) <= 0 ||
        Number(exercicio.repeticoes_realizadas) <= 0,
    );

    if (exerciciosInvalidos) {
      setMensagem("Preencha corretamente os dados de todos os exercícios.");
      return;
    }
    const duracao = formatarTempo(Date.now() - inicioTreino);

    setTempoDecorrido(Date.now() - inicioTreino);
    setInicioTreino(null);
    setSalvando(true);
    setMensagem("");

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
      });

      setMensagem("Treino registrado com sucesso!");
      await carregarRegistros();
    } catch (err) {
      setMensagem(err.response?.data?.error || "Erro ao registrar treino");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
      <Aside user={user} setUser={setUser} />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Meus registros de treino</h1>

          <p className="mt-2 text-sm text-[#111310]/60">
            Registre suas atividades e acompanhe seu histórico.
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
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Histórico</h2>

            {registros.length === 0 ? (
              <p className="mt-4 text-gray-500">Nenhum treino registrado.</p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Hora</th>
                      <th className="px-4 py-3">Duração</th>
                      <th className="px-4 py-3">Exercícios realizados</th>
                    </tr>
                  </thead>

                  <tbody>
                    {registros.map((registro) => (
                      <tr
                        key={registro.id_registro}
                        className="border-b border-gray-100"
                      >
                        <td className="px-4 py-3">
                          {new Date(registro.data_registro).toLocaleDateString(
                            "pt-BR",
                          )}
                        </td>

                        <td className="px-4 py-3">{registro.hora}</td>

                        <td className="px-4 py-3">{registro.duracao}</td>

                        <td className="px-4 py-3">
                          {registro.exercicios.map((exercicio, index) => (
                            <div key={index} className="mb-3">
                              <strong>{exercicio.exercicio}</strong>

                              <p className="text-sm text-gray-600">
                                Carga: {exercicio.carga} kg | Séries:{" "}
                                {exercicio.series} | Repetições:{" "}
                                {exercicio.repeticoes}
                              </p>

                              <p className="text-sm">
                                {exercicio.concluido
                                  ? "Concluído"
                                  : "Não concluído"}
                              </p>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
