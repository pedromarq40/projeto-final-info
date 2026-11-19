
import { useEffect, useState } from "react"
import api from "../../api/api.js"
import Aside from "../../components/Aside.jsx"

const formatarCPF = (cpf = "") =>
  cpf.length === 11 ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf

const formatarTelefone = (tel = "") =>
  tel.length === 11 ? tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : tel

const formatarData = (data) => {
  if (!data) return "—"
  const d = new Date(data)
  return isNaN(d) ? "—" : d.toLocaleDateString("pt-BR", { timeZone: "UTC" })
}

const vazio = (valor, sufixo = "") =>
  valor === null || valor === undefined || valor === "" ? "—" : `${valor}${sufixo}`

export default function Alunos({ user, setUser }) {
  const [alunos, setAlunos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [busca, setBusca] = useState("")
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [exercicios, setExercicios] = useState([])
  const [selecionados, setSelecionados] = useState({})
  const [foco, setFoco] = useState("")
  const [tipo, setTipo] = useState("")
  const [validade, setValidade] = useState("")
  const [carregandoExercicios, setCarregandoExercicios] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [erroFormulario, setErroFormulario] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get("/alunos")
        setAlunos(data)
      } catch (error) {
        setErro(error.response?.data?.error || "Não foi possível carregar os alunos.")
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  async function abrirFormulario(aluno) {
    setAlunoSelecionado(aluno)
    setErroFormulario("")
    setMensagem("")
    setSelecionados({})
    setFoco("")
    setTipo("")
    setValidade("")
    setCarregandoExercicios(true)

    try {
      const { data } = await api.get("/exercicios")
      setExercicios(data)
    } catch (error) {
      setErroFormulario(error.response?.data?.error || "Não foi possível carregar os exercícios.")
    } finally {
      setCarregandoExercicios(false)
    }
  }

  function fecharFormulario() {
    setAlunoSelecionado(null)
    setSelecionados({})
    setErroFormulario("")
    setMensagem("")
  }

  function alternarExercicio(exercicio) {
    const id = exercicio.id_exercicio
    setSelecionados((anteriores) => {
      const novos = { ...anteriores }
      if (novos[id]) {
        delete novos[id]
      } else {
        novos[id] = { id_exercicio: id, carga: "", series: "", repeticoes: "" }
      }
      return novos
    })
  }

  function alterarExercicio(id, campo, valor) {
    setSelecionados((anteriores) => ({
      ...anteriores,
      [id]: { ...anteriores[id], [campo]: valor }
    }))
  }

  async function criarFicha(e) {
    e.preventDefault()
    setErroFormulario("")
    setMensagem("")

    const listaExercicios = Object.values(selecionados)

    if (!foco || !tipo || !validade || listaExercicios.length === 0) {
      setErroFormulario("Preencha os dados da ficha e selecione pelo menos um exercício.")
      return
    }

    const exerciciosInvalidos = listaExercicios.some((ex) =>
      ex.carga === "" || ex.series === "" || ex.repeticoes === "" ||
      Number(ex.carga) < 0 || Number(ex.series) <= 0 || Number(ex.repeticoes) <= 0
    )

    if (exerciciosInvalidos) {
      setErroFormulario("Preencha corretamente carga, séries e repetições de cada exercício.")
      return
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
        repeticoes: Number(ex.repeticoes)
      }))
    }

    setSalvando(true)
    try {
      await api.post("/fichas-de-treino/criar", dados)
      setMensagem("Ficha de treino criada com sucesso!")
      setTimeout(() => fecharFormulario(), 1500)
    } catch (error) {
      setErroFormulario(error.response?.data?.error || "Não foi possível criar a ficha.")
    } finally {
      setSalvando(false)
    }
  }

  const termo = busca.trim().toLowerCase()
  const filtrados = alunos.filter((a) =>
    a.nome_completo?.toLowerCase().includes(termo) ||
    a.email?.toLowerCase().includes(termo)
  )

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
      <Aside user={user} setUser={setUser} />
      <main className="min-w-0 flex-1 px-6 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Alunos</h1>
              <p className="mt-1 text-sm text-[#111310]/50">
                {carregando ? "Carregando..." : `${filtrados.length} de ${alunos.length} alunos`}
              </p>
            </div>
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou e-mail"
              className="w-full max-w-xs rounded-xl border border-transparent bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all duration-300 placeholder:text-[#111310]/40 focus:border-[#a6ee1f] focus:shadow-[0_0_0_4px_rgba(166,238,31,0.25)]"
            />
          </div>

          {erro && <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

          {!carregando && !erro && filtrados.length === 0 && (
            <p className="mt-8 rounded-xl bg-white px-4 py-10 text-center text-sm text-[#111310]/50 shadow-sm">
              Nenhum aluno encontrado.
            </p>
          )}

          {filtrados.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#111310]/10 text-[11px] font-bold uppercase tracking-widest text-[#111310]/50">
                    <th className="px-5 py-4">Nome</th>
                    <th className="px-5 py-4">CPF</th>
                    <th className="px-5 py-4">E-mail</th>
                    <th className="px-5 py-4">Telefone</th>
                    <th className="px-5 py-4">Altura</th>
                    <th className="px-5 py-4">Peso</th>
                    <th className="px-5 py-4">Problemas de saúde</th>
                    <th className="px-5 py-4">Cadastro</th>
                    <th className="px-5 py-4">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((a) => (
                    <tr key={a.CPF} className="border-b border-[#111310]/5 transition-colors last:border-0 hover:bg-gray-100">
                      <td className="px-5 py-4 font-semibold">{a.nome_completo}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{formatarCPF(a.CPF)}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{a.email}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{formatarTelefone(a.telefone)}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{vazio(a.altura, " m")}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{vazio(a.peso, " kg")}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{vazio(a.problemas_saude)}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{formatarData(a.data_criacao)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => abrirFormulario(a)}
                          className="whitespace-nowrap rounded-lg bg-[#a6ee1f] px-4 py-2 text-xs font-bold text-[#111310] transition hover:bg-[#91d719]"
                        >
                          Criar ficha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Criar ficha de treino</h2>
                <p className="mt-1 text-sm text-gray-500">Aluno: {alunoSelecionado.nome_completo}</p>
              </div>
              <button onClick={fecharFormulario} className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>

            <form onSubmit={criarFicha}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold">Foco</label>
                  <input value={foco} onChange={(e) => setFoco(e.target.value)} maxLength={15} placeholder="Ex.: Hipertrofia" className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a6ee1f]" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold">Tipo</label>
                  <input value={tipo} onChange={(e) => setTipo(e.target.value)} maxLength={15} placeholder="Ex.: Treino A" className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a6ee1f]" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold">Validade</label>
                  <input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#a6ee1f]" required />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 font-bold">Exercícios</h3>
                {carregandoExercicios ? (
                  <p className="text-sm text-gray-500">Carregando exercícios...</p>
                ) : exercicios.length === 0 ? (
                  <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">Nenhum exercício cadastrado.</p>
                ) : (
                  <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
                    {exercicios.map((ex) => (
                      <div key={ex.id_exercicio} className="rounded-xl border border-gray-200 p-3">
                        <label className="flex cursor-pointer items-center gap-2 font-semibold">
                          <input type="checkbox" checked={!!selecionados[ex.id_exercicio]} onChange={() => alternarExercicio(ex)} className="h-4 w-4 accent-[#a6ee1f]" />
                          {ex.nome}
                        </label>
                        {selecionados[ex.id_exercicio] && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div>
                              <label className="mb-1 block text-xs text-gray-500">Carga (kg)</label>
                              <input type="number" min="0" step="1" value={selecionados[ex.id_exercicio].carga} onChange={(e) => alterarExercicio(ex.id_exercicio, "carga", e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" required />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-gray-500">Séries</label>
                              <input type="number" min="1" value={selecionados[ex.id_exercicio].series} onChange={(e) => alterarExercicio(ex.id_exercicio, "series", e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" required />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-gray-500">Repetições</label>
                              <input type="number" min="1" value={selecionados[ex.id_exercicio].repeticoes} onChange={(e) => alterarExercicio(ex.id_exercicio, "repeticoes", e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" required />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {erroFormulario && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erroFormulario}</p>}
              {mensagem && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{mensagem}</p>}

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={fecharFormulario} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100">Cancelar</button>
                <button type="submit" disabled={salvando || carregandoExercicios || exercicios.length === 0} className="rounded-lg bg-[#a6ee1f] px-5 py-2 text-sm font-bold text-[#111310] hover:bg-[#91d719] disabled:cursor-not-allowed disabled:opacity-50">
                  {salvando ? "Salvando..." : "Salvar ficha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
