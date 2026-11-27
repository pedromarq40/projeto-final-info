import { useEffect, useState } from "react";
import api from "../../api/api.js";
import Aside from "../../components/Aside.jsx";

const formatarCPF = (cpf = "") =>
  cpf.length === 11
    ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    : cpf;

const formatarTelefone = (tel = "") =>
  tel.length === 11 ? tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : tel;

const formatarData = (data) => {
  if (!data) return "—";
  const d = new Date(data);
  return isNaN(d) ? "—" : d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const vazio = (valor, sufixo = "") =>
  valor === null || valor === undefined || valor === ""
    ? "—"
    : `${valor}${sufixo}`;

const formatarValor = (valor) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CAMPOS_ALUNO = [
  {
    chave: "nome",
    label: "Nome",
    valor: (aluno) => vazio(aluno.nome_completo),
  },
  { chave: "cpf", label: "CPF", valor: (aluno) => formatarCPF(aluno.CPF) },
  { chave: "email", label: "E-mail", valor: (aluno) => vazio(aluno.email) },
  {
    chave: "telefone",
    label: "Telefone",
    valor: (aluno) => formatarTelefone(aluno.telefone),
  },
  {
    chave: "altura",
    label: "Altura",
    valor: (aluno) => vazio(aluno.altura, " m"),
  },
  { chave: "peso", label: "Peso", valor: (aluno) => vazio(aluno.peso, " kg") },
  {
    chave: "problemas_saude",
    label: "Problemas de saúde",
    valor: (aluno) => vazio(aluno.problemas_saude),
  },
  {
    chave: "data_criacao",
    label: "Cadastro",
    valor: (aluno) => formatarData(aluno.data_criacao),
  },
  {
    chave: "assinatura",
    label: "Plano",
    valor: (aluno) => vazio(aluno.assinatura),
  },
];

export default function Alunos({ user, setUser }) {
  const [alunos, setAlunos] = useState([]);
  const [mensalidadesPorAluno, setMensalidadesPorAluno] = useState({});
  const [planosAtivosPorAluno, setPlanosAtivosPorAluno] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [colunasVisiveis, setColunasVisiveis] = useState([
    "nome",
    "cpf",
    "email",
    "telefone",
  ]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [alunoDetalhado, setAlunoDetalhado] = useState(null);
  const [buscaExercicio, setBuscaExercicio] = useState("");
  const [exerciciosEncontrados, setExerciciosEncontrados] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [selecionados, setSelecionados] = useState({});
  const [foco, setFoco] = useState("");
  const [tipo, setTipo] = useState("");
  const [validade, setValidade] = useState("");
  const [carregandoExercicios, setCarregandoExercicios] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");
  const [alunoFinanceiro, setAlunoFinanceiro] = useState(null);
  const [fichaEmEdicao, setFichaEmEdicao] = useState(false);
  const [cancelando, setCancelando] = useState(null);
  const [mensagemFinanceira, setMensagemFinanceira] = useState("");
  const [erroFinanceiro, setErroFinanceiro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [respostaAlunos, respostaMensalidades, respostaAssinaturas] =
          await Promise.all([
            api.get("/alunos"),
            api.get("/mensalidades/alunos"),
            api.get("/assinaturas/ativas"),
          ]);

        const porAluno = {};
        const planosAtivos = {};

        respostaMensalidades.data.forEach((mensalidade) => {
          if (!mensalidade.data_geracao) return;

          if (!porAluno[mensalidade.CPF]) {
            porAluno[mensalidade.CPF] = [];
          }

          porAluno[mensalidade.CPF].push(mensalidade);
        });

        respostaAssinaturas.data.forEach((assinatura) => {
          planosAtivos[assinatura.CPF] = assinatura.plano;
        });

        setAlunos(respostaAlunos.data);
        setMensalidadesPorAluno(porAluno);
        setPlanosAtivosPorAluno(planosAtivos);
      } catch (error) {
        setErro(
          error.response?.data?.error ||
            "Não foi possível carregar os alunos e suas mensalidades.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);
  async function abrirFormulario(aluno) {
    setAlunoSelecionado(aluno);
    setErroFormulario("");
    setMensagem("");
    setSelecionados({});
    setFichaEmEdicao(false);
    setFoco("");
    setTipo("");
    setValidade("");
    setBuscaExercicio("");
    setExerciciosEncontrados([]);
    setDropdownAberto(false);
    setCarregandoExercicios(false);

    try {
      const { data } = await api.get(`/fichas-de-treino/editar/${aluno.CPF}`);
      setFichaEmEdicao(true);
      setFoco(data.ficha.foco);
      setTipo(data.ficha.tipo);

      if (data.ficha.validade) {
        const validade = new Date(data.ficha.validade);
        setValidade(validade.toISOString().slice(0, 10));
      } else {
        setValidade("");
      }

      const exerciciosPreenchidos = {};

      data.exercicios.forEach((exercicio) => {
        if (!exercicio.id_exercicio) {
          return;
        }

        exerciciosPreenchidos[exercicio.id_exercicio] = {
          id_exercicio: exercicio.id_exercicio,
          nome: exercicio.nome,
          carga: exercicio.carga,
          series: exercicio.series,
          repeticoes: exercicio.repeticoes,
          ordem: exercicio.ordem,
        };
      });

      setSelecionados(exerciciosPreenchidos);
    } catch (error) {
      if (error.response?.status !== 404) {
        setErroFormulario(
          error.response?.data?.error ||
            "Não foi possível carregar a ficha de treino.",
        );
      }
    }
  }

  function fecharFormulario() {
    setAlunoSelecionado(null);
    setSelecionados({});
    setFichaEmEdicao(false);
    setBuscaExercicio("");
    setExerciciosEncontrados([]);
    setDropdownAberto(false);
    setErroFormulario("");
    setMensagem("");
  }

  function alternarExercicio(exercicio) {
    const id = exercicio.id_exercicio;
    const selecionado = selecionados[id];

    if (selecionado) {
      const novos = { ...selecionados };
      delete novos[id];
      setSelecionados(normalizarOrdens(novos));
    } else {
      const quantidade = Object.keys(selecionados).length;
      setSelecionados({
        ...selecionados,
        [id]: {
          id_exercicio: id,
          nome: exercicio.nome,
          carga: "",
          series: "",
          repeticoes: "",
          ordem: quantidade + 1,
        },
      });
    }

    setBuscaExercicio("");
    setExerciciosEncontrados([]);
    setDropdownAberto(false);
  }

  function alterarExercicio(id, campo, valor) {
    setSelecionados((anteriores) => ({
      ...anteriores,
      [id]: { ...anteriores[id], [campo]: valor },
    }));
  }

  function normalizarOrdens(itens) {
    const ordenados = Object.values(itens).sort((a, b) => a.ordem - b.ordem);

    const normalizados = {};

    ordenados.forEach((item, indice) => {
      normalizados[item.id_exercicio] = {
        ...item,
        ordem: indice + 1,
      };
    });

    return normalizados;
  }

  function moverExercicio(id, direcao) {
    const ordenados = Object.values(selecionados).sort(
      (a, b) => a.ordem - b.ordem,
    );
    const indice = ordenados.findIndex((item) => item.id_exercicio === id);
    const novoIndice = indice + direcao;

    if (indice < 0) {
      return;
    }

    if (novoIndice < 0) {
      return;
    }

    if (novoIndice >= ordenados.length) {
      return;
    }

    const itemAtual = ordenados[indice];
    ordenados[indice] = ordenados[novoIndice];
    ordenados[novoIndice] = itemAtual;

    const novos = {};
    ordenados.forEach((item, index) => {
      novos[item.id_exercicio] = {
        ...item,
        ordem: index + 1,
      };
    });

    setSelecionados(novos);
  }

  useEffect(() => {
    if (!buscaExercicio.trim()) {
      return;
    }

    const timeout = setTimeout(async () => {
      setCarregandoExercicios(true);

      try {
        const { data } = await api.get("/exercicios", {
          params: {
            pagina: 1,
            limite: 10,
            nome: buscaExercicio.trim(),
          },
        });
        setExerciciosEncontrados(data.dados);
        setDropdownAberto(true);
        setErroFormulario("");
      } catch (error) {
        setErroFormulario(
          error.response?.data?.error ||
            "Não foi possível pesquisar exercícios.",
        );
      } finally {
        setCarregandoExercicios(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [buscaExercicio]);

  async function criarFicha(e) {
    e.preventDefault();
    setErroFormulario("");
    setMensagem("");

    const listaExercicios = Object.values(selecionados);

    if (!foco || !tipo || !validade || listaExercicios.length === 0) {
      setErroFormulario(
        "Preencha os dados da ficha e selecione pelo menos um exercício.",
      );
      return;
    }

    const exerciciosInvalidos = listaExercicios.some((ex) => {
      if (ex.carga === "") {
        return true;
      }
      if (ex.series === "") {
        return true;
      }
      if (ex.repeticoes === "") {
        return true;
      }
      if (Number(ex.carga) < 0) {
        return true;
      }
      if (Number(ex.series) <= 0) {
        return true;
      }
      if (Number(ex.repeticoes) <= 0) {
        return true;
      }
      return false;
    });

    if (exerciciosInvalidos) {
      setErroFormulario(
        "Preencha corretamente carga, séries e repetições de cada exercício.",
      );
      return;
    }

    const dados = {
      CPF: alunoSelecionado.CPF,
      foco,
      tipo,
      validade,
      exercicios: listaExercicios.map((ex) => ({
        id_exercicio: ex.id_exercicio,
        carga: Number(ex.carga),
        series: Number(ex.series),
        repeticoes: Number(ex.repeticoes),
        ordem: ex.ordem,
      })),
    };

    setSalvando(true);
    try {
      if (fichaEmEdicao) {
        await api.put(
          `/fichas-de-treino/editar/${alunoSelecionado.CPF}`,
          dados,
        );
        setMensagem("Ficha de treino atualizada com sucesso!");
      } else {
        await api.post("/fichas-de-treino/criar", dados);
        setMensagem("Ficha de treino criada com sucesso!");
      }
      setTimeout(() => fecharFormulario(), 1500);
    } catch (error) {
      setErroFormulario(
        error.response?.data?.error || "Não foi possível criar a ficha.",
      );
    } finally {
      setSalvando(false);
    }
  }
  async function cancelarMensalidade(mensalidade, aluno) {
    const confirmar = window.confirm(
      `Deseja cancelar a mensalidade de ${formatarValor(mensalidade.valor)} do aluno ${aluno.nome_completo}?`,
    );

    if (!confirmar) return;

    const chave = `${mensalidade.data_geracao}-${mensalidade.id_plano}`;

    setCancelando(chave);
    setMensagemFinanceira("");
    setErroFinanceiro("");

    try {
      await api.put("/mensalidades/cancelar", {
        CPF: aluno.CPF,
        data_geracao: String(mensalidade.data_geracao).slice(0, 10),
        id_plano: mensalidade.id_plano,
      });

      setMensalidadesPorAluno((anteriores) => ({
        ...anteriores,
        [aluno.CPF]: anteriores[aluno.CPF].map((m) =>
          String(m.data_geracao).slice(0, 10) ===
            String(mensalidade.data_geracao).slice(0, 10) &&
          m.id_plano === mensalidade.id_plano
            ? { ...m, status: "cancelada" }
            : m,
        ),
      }));

      setMensagemFinanceira("Mensalidade cancelada com sucesso!");
    } catch (error) {
      setErroFinanceiro(
        error.response?.data?.error ||
          "Não foi possível cancelar a mensalidade.",
      );
    } finally {
      setCancelando(null);
    }
  }

  const termo = busca.trim().toLowerCase();

  const filtrados = alunos.filter(
    (a) =>
      a.nome_completo?.toLowerCase().includes(termo) ||
      a.email?.toLowerCase().includes(termo),
  );

  const colunasAtivas = CAMPOS_ALUNO.filter((campo) =>
    colunasVisiveis.includes(campo.chave),
  );

  function alternarColuna(chave) {
    setColunasVisiveis((visiveis) =>
      visiveis.includes(chave)
        ? visiveis.filter((coluna) => coluna !== chave)
        : [...visiveis, chave],
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
      <Aside user={user} setUser={setUser} />
      <main className="min-w-0 flex-1 px-6 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Alunos</h1>
              <p className="mt-1 text-sm text-[#111310]/50">
                {carregando
                  ? "Carregando..."
                  : `${filtrados.length} de ${alunos.length} alunos`}
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
              <details className="relative">
                <summary className="cursor-pointer list-none rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-50">
                  Campos exibidos
                </summary>
                <div className="absolute right-0 z-20 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                  {CAMPOS_ALUNO.map((campo) => (
                    <label
                      key={campo.chave}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={colunasVisiveis.includes(campo.chave)}
                        onChange={() => alternarColuna(campo.chave)}
                        className="accent-[#a6ee1f]"
                      />
                      {campo.label}
                    </label>
                  ))}
                </div>
              </details>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou e-mail"
                className="w-full max-w-xs rounded-xl border border-transparent bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all duration-300 placeholder:text-[#111310]/40 focus:border-[#a6ee1f] focus:shadow-[0_0_0_4px_rgba(166,238,31,0.25)]"
              />
            </div>
          </div>

          {erro && (
            <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          {!carregando && !erro && filtrados.length === 0 && (
            <p className="mt-8 rounded-xl bg-white px-4 py-10 text-center text-sm text-[#111310]/50 shadow-sm">
              Nenhum aluno encontrado.
            </p>
          )}

          {filtrados.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#111310]/10 text-[11px] font-bold uppercase tracking-widest text-[#111310]/50">
                    {colunasAtivas.map((campo) => (
                      <th key={campo.chave} className="px-5 py-4">
                        {campo.label}
                      </th>
                    ))}
                    <th className="px-5 py-4">Mensalidades</th>
                    <th className="px-5 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((a) => {
                    const mensalidades = mensalidadesPorAluno[a.CPF] || [];
                    const atrasadas = mensalidades.filter(
                      (m) => m.status === "atrasada",
                    ).length;
                    const pagas = mensalidades.filter(
                      (m) => m.status === "paga",
                    ).length;
                    const planoAtivo = planosAtivosPorAluno[a.CPF];
                    const valoresAluno = {
                      ...a,
                      assinatura: planoAtivo || "Sem plano vigente",
                    };

                    return (
                      <tr key={a.CPF}>
                        {colunasAtivas.map((campo) => (
                          <td key={campo.chave}>{campo.valor(valoresAluno)}</td>
                        ))}

                        <td className="px-5 py-4">
                          <span
                            className={
                              atrasadas > 0
                                ? "font-bold text-red-700"
                                : "font-medium text-green-700"
                            }
                          >
                            {atrasadas} atrasada{atrasadas === 1 ? "" : "s"}
                          </span>
                          <p className="mt-1 text-xs text-[#111310]/60">
                            {pagas} paga{pagas === 1 ? "" : "s"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <button
                              onClick={() => setAlunoDetalhado(a)}
                              className="whitespace-nowrap rounded-lg border border-[#111310]/15 px-4 py-2 text-xs font-bold transition hover:bg-gray-100"
                            >
                              Ver detalhes
                            </button>
                            <button
                              onClick={() => setAlunoFinanceiro(a)}
                              className="whitespace-nowrap rounded-lg border border-[#111310]/15 px-4 py-2 text-xs font-bold transition hover:bg-gray-100"
                            >
                              Mensalidades
                            </button>
                            <button
                              onClick={() => abrirFormulario(a)}
                              disabled={!planoAtivo}
                              title={
                                !planoAtivo
                                  ? "O aluno precisa de uma assinatura vigente"
                                  : undefined
                              }
                              className="whitespace-nowrap rounded-lg bg-[#a6ee1f] px-4 py-2 text-xs font-bold text-[#111310] transition hover:bg-[#91d719] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Criar ficha
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {alunoDetalhado &&
        (() => {
          const mensalidades = mensalidadesPorAluno[alunoDetalhado.CPF] || [];
          const atrasadas = mensalidades.filter(
            (mensalidade) => mensalidade.status === "atrasada",
          ).length;
          const pagas = mensalidades.filter(
            (mensalidade) => mensalidade.status === "paga",
          ).length;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
              <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Dados do aluno</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {alunoDetalhado.nome_completo}
                    </p>
                  </div>
                  <button
                    onClick={() => setAlunoDetalhado(null)}
                    className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                    aria-label="Fechar detalhes"
                  >
                    ×
                  </button>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2">
                  {CAMPOS_ALUNO.map((campo) => (
                    <div
                      key={campo.chave}
                      className="rounded-xl bg-gray-50 p-4"
                    >
                      <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">
                        {campo.label}
                      </dt>
                      <dd className="mt-1 break-words text-sm font-medium text-[#111310]">
                        {campo.chave === "assinatura"
                          ? planosAtivosPorAluno[alunoDetalhado.CPF] ||
                            "Sem plano vigente"
                          : campo.valor(alunoDetalhado)}
                      </dd>
                    </div>
                  ))}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Mensalidades
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-[#111310]">
                      {pagas} pagas · {atrasadas} atrasadas
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          );
        })()}

      {alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                {fichaEmEdicao && (
                  <h2 className="text-2xl font-bold">Editar ficha de treino</h2>
                )}
                {!fichaEmEdicao && (
                  <h2 className="text-2xl font-bold">Criar ficha de treino</h2>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Aluno: {alunoSelecionado.nome_completo}
                </p>
              </div>
              <button
                onClick={fecharFormulario}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={criarFicha}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Foco
                  </label>
                  <input
                    value={foco}
                    onChange={(e) => setFoco(e.target.value)}
                    maxLength={15}
                    placeholder="Ex.: Hipertrofia"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a6ee1f]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Tipo
                  </label>
                  <input
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    maxLength={15}
                    placeholder="Ex.: Treino A"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a6ee1f]"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold">
                    Validade
                  </label>
                  <input
                    type="date"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a6ee1f]"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 font-bold">Exercícios</h3>
                <div className="relative">
                  <input
                    type="search"
                    value={buscaExercicio}
                    onChange={(event) => {
                      const valor = event.target.value;
                      setBuscaExercicio(valor);
                      if (!valor.trim()) {
                        setExerciciosEncontrados([]);
                        setDropdownAberto(false);
                      }
                    }}
                    placeholder="Pesquisar exercício por nome"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a6ee1f]"
                  />

                  {dropdownAberto && (
                    <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {carregandoExercicios && (
                        <p className="px-3 py-3 text-sm text-gray-500">
                          Pesquisando...
                        </p>
                      )}
                      {!carregandoExercicios &&
                        exerciciosEncontrados.length === 0 && (
                          <p className="px-3 py-3 text-sm text-gray-500">
                            Nenhum exercício encontrado.
                          </p>
                        )}
                      {!carregandoExercicios &&
                        exerciciosEncontrados.map((ex) => (
                          <button
                            key={ex.id_exercicio}
                            type="button"
                            onClick={() => alternarExercicio(ex)}
                            disabled={!!selecionados[ex.id_exercicio]}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {ex.nome}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-2">
                  {Object.values(selecionados)
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((ex) => (
                      <div
                        key={ex.id_exercicio}
                        className="rounded-xl border border-gray-200 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">{ex.nome}</p>
                          <button
                            type="button"
                            onClick={() => alternarExercicio(ex)}
                            className="text-sm font-semibold text-red-700 hover:underline"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-6">
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Ordem
                            </label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={ex.ordem}
                              onChange={(event) =>
                                alterarExercicio(
                                  ex.id_exercicio,
                                  "ordem",
                                  Number(event.target.value),
                                )
                              }
                              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Carga (kg)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={ex.carga}
                              onChange={(event) =>
                                alterarExercicio(
                                  ex.id_exercicio,
                                  "carga",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Séries
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={ex.series}
                              onChange={(event) =>
                                alterarExercicio(
                                  ex.id_exercicio,
                                  "series",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Repetições
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={ex.repeticoes}
                              onChange={(event) =>
                                alterarExercicio(
                                  ex.id_exercicio,
                                  "repeticoes",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                              required
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() =>
                                moverExercicio(ex.id_exercicio, -1)
                              }
                              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm hover:bg-gray-100"
                            >
                              Subir
                            </button>
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => moverExercicio(ex.id_exercicio, 1)}
                              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm hover:bg-gray-100"
                            >
                              Descer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {erroFormulario && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {erroFormulario}
                </p>
              )}
              {mensagem && (
                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {mensagem}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={fecharFormulario}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando || Object.keys(selecionados).length === 0}
                  className="rounded-lg bg-[#a6ee1f] px-5 py-2 text-sm font-bold text-[#111310] hover:bg-[#91d719] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvando && "Salvando..."}
                  {!salvando && fichaEmEdicao && "Salvar alterações"}
                  {!salvando && !fichaEmEdicao && "Salvar ficha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {alunoFinanceiro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Mensalidades</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Aluno: {alunoFinanceiro.nome_completo}
                </p>
              </div>
              <button
                onClick={() => setAlunoFinanceiro(null)}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            {mensagemFinanceira && (
              <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {mensagemFinanceira}
              </p>
            )}

            {erroFinanceiro && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {erroFinanceiro}
              </p>
            )}
            {(mensalidadesPorAluno[alunoFinanceiro.CPF] || []).length === 0 ? (
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                Nenhuma mensalidade cadastrada.
              </p>
            ) : (
              <div className="max-h-[60vh] overflow-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="px-3 py-3">Plano</th>
                      <th className="px-3 py-3">Valor</th>
                      <th className="px-3 py-3">Vencimento</th>
                      <th className="px-3 py-3">Pagamento</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(mensalidadesPorAluno[alunoFinanceiro.CPF] || []).map(
                      (mensalidade) => (
                        <tr
                          key={`${mensalidade.data_geracao}-${mensalidade.id_plano}`}
                          className="border-b border-gray-100"
                        >
                          <td className="px-3 py-3">{mensalidade.plano}</td>
                          <td className="px-3 py-3">
                            {formatarValor(mensalidade.valor)}
                          </td>
                          <td className="px-3 py-3">
                            {formatarData(mensalidade.vencimento)}
                          </td>
                          <td className="px-3 py-3">
                            {formatarData(mensalidade.data_pagamento)}
                          </td>
                          <td
                            className={`px-3 py-3 font-semibold ${
                              mensalidade.status === "paga"
                                ? "text-green-700"
                                : mensalidade.status === "atrasada"
                                  ? "text-red-700"
                                  : mensalidade.status === "cancelada"
                                    ? "text-gray-500"
                                    : "text-amber-700"
                            }`}
                          >
                            {mensalidade.status === "paga"
                              ? "Paga"
                              : mensalidade.status === "atrasada"
                                ? "Atrasada"
                                : mensalidade.status === "cancelada"
                                  ? "Cancelada"
                                  : "Pendente"}
                          </td>
                          <td className="px-3 py-3">
                            {mensalidade.status === "atrasada" && (
                              <button
                                onClick={() =>
                                  cancelarMensalidade(
                                    mensalidade,
                                    alunoFinanceiro,
                                  )
                                }
                                disabled={
                                  cancelando ===
                                  `${mensalidade.data_geracao}-${mensalidade.id_plano}`
                                }
                                className="whitespace-nowrap rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                              >
                                {cancelando ===
                                `${mensalidade.data_geracao}-${mensalidade.id_plano}`
                                  ? "Cancelando..."
                                  : "Cancelar"}
                              </button>
                            )}
                            {mensalidade.status !== "atrasada" && "—"}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
