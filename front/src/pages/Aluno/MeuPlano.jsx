import { useEffect, useState } from "react";
import api from "../../api/api.js";
import Aside from "../../components/Aside.jsx";

export default function MeuPlano({ user, setUser }) {
  const [assinatura, setAssinatura] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [duracaoMeses, setDuracaoMeses] = useState("1");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregarDados() {
    try {
      const respostaPlanos = await api.get("/planos");
      const respostaAssinatura = await api.get("/assinaturas/minha");

      setPlanos(respostaPlanos.data.filter((plano) => plano.efetivo));
      setAssinatura(respostaAssinatura.data[0] || null);
    } catch (err) {
      setMensagem(err.response?.data?.error || "Erro ao carregar planos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function trocarPlano(e) {
    e.preventDefault();
    setMensagem("");

    if (!planoSelecionado) {
      setMensagem("Selecione um plano.");
      return;
    }

    setSalvando(true);
    try {
      await api.put("/assinaturas/trocar", {
        id_plano: Number(planoSelecionado),
        duracao_meses: Number(duracaoMeses),
      });

      setMensagem("Assinatura realizada com sucesso!");
      setPlanoSelecionado("");
      await carregarDados();
    } catch (err) {
      setMensagem(err.response?.data?.error || "Erro ao realizar assinatura");
    } finally {
      setSalvando(false);
    }
  }

  function formatarValor(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  }

  const hoje = new Date().toISOString().slice(0, 10);
  const assinaturaAtiva =
    assinatura &&
    new Date(assinatura.data_vencimento).toISOString().slice(0, 10) >= hoje;
  const planoEscolhido = planos.find(
    (plano) => String(plano.id_plano) === String(planoSelecionado),
  );

  const intervalo = planoEscolhido?.nome
    ?.toLowerCase()
    .trim()
    .includes("trimestral")
    ? 3
    : 1;
  useEffect(() => {
    setDuracaoMeses(String(intervalo));
  }, [intervalo]);

  const quantidadeMensalidades = Math.ceil(Number(duracaoMeses) / intervalo);

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
      <Aside user={user} setUser={setUser} />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Meu plano</h1>

          <p className="mt-2 text-sm text-[#111310]/60">
            Consulte sua assinatura e escolha seu plano.
          </p>

          {mensagem && (
            <p
              className={`mt-5 text-sm font-medium ${
                mensagem.includes("sucesso") ? "text-green-600" : "text-red-600"
              }`}
            >
              {mensagem}
            </p>
          )}

          {carregando ? (
            <p className="mt-6 text-gray-500">Carregando...</p>
          ) : (
            <>
              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Minha assinatura atual</h2>

                {assinatura ? (
                  <div className="mt-5 space-y-3">
                    <p>
                      <strong>Plano:</strong> {assinatura.nome}
                    </p>

                    <p>
                      <strong>Valor do plano: </strong>{" "}
                      {formatarValor(assinatura.valor_mensal)}
                    </p>

                    <p>
                      <strong>Data da assinatura:</strong>{" "}
                      {formatarData(assinatura.data_assinatura)}
                    </p>

                    <p>
                      <strong>Vencimento:</strong>{" "}
                      {formatarData(assinatura.data_vencimento)}
                    </p>

                    <p>
                      <strong>Duração:</strong> {assinatura.duracao_meses}{" "}
                      {assinatura.duracao_meses === 1 ? "mês" : "meses"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-500">
                    Você ainda não possui uma assinatura.
                  </p>
                )}
              </div>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Assinar um plano</h2>

                {assinaturaAtiva ? (
                  <p className="mt-4 text-gray-500">
                    Sua assinatura está vigente até{" "}
                    {formatarData(assinatura.data_vencimento)}. Você poderá
                    assinar novamente após essa data.
                  </p>
                ) : planos.length === 0 ? (
                  <p className="mt-4 text-gray-500">Nenhum plano disponível.</p>
                ) : (
                  <form onSubmit={trocarPlano}>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {planos.map((plano) => (
                        <label
                          key={plano.id_plano}
                          className={`cursor-pointer rounded-xl border p-5 ${
                            String(planoSelecionado) === String(plano.id_plano)
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="plano"
                            value={plano.id_plano}
                            checked={
                              String(planoSelecionado) ===
                              String(plano.id_plano)
                            }
                            onChange={(e) =>
                              setPlanoSelecionado(e.target.value)
                            }
                            className="mr-2"
                          />

                          <span className="font-bold">{plano.nome}</span>

                          <p className="mt-3 text-lg font-semibold">
                            {formatarValor(plano.valor_mensal)}
                          </p>
                        </label>
                      ))}
                    </div>

                    <label className="mt-5 block max-w-xs text-sm font-semibold">
                      Duração da assinatura
                      <select
                        value={duracaoMeses}
                        onChange={(e) => setDuracaoMeses(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                      >
                        {Array.from(
                          { length: Math.floor(24 / intervalo) },
                          (_, index) => (index + 1) * intervalo,
                        ).map((meses) => (
                          <option key={meses} value={meses}>
                            {meses} {meses === 1 ? "mês" : "meses"}
                          </option>
                        ))}
                      </select>
                    </label>

                    <p className="mt-3 text-sm text-gray-500">
                      Serão geradas {quantidadeMensalidades} mensalidades, com
                      cobrança a cada {intervalo}{" "}
                      {intervalo === 1 ? "mês" : "meses"}. O pagamento não é
                      processado pela plataforma.
                    </p>

                    <button
                      type="submit"
                      disabled={salvando}
                      className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {salvando ? "Processando..." : "Confirmar assinatura"}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
