import { useEffect, useState } from "react"
import api from "../../api/api.js"
import Aside from "../../components/Aside.jsx"

const formularioInicial = { nome: "", video: "" }

export default function Exercicios({ user, setUser }) {
  const [exercicios, setExercicios] = useState([])
  const [formulario, setFormulario] = useState(formularioInicial)
  const [exercicioEmEdicao, setExercicioEmEdicao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [busca, setBusca] = useState("")
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const limite = 10

  async function carregarExercicios(paginaAtual = pagina, buscaAtual = busca) {
    try {
      const { data } = await api.get("/exercicios", {
        params: {
          pagina: paginaAtual,
          limite,
          nome: buscaAtual
        }
      })
      setExercicios(data.dados)
      setPagina(data.pagina)
      setTotalPaginas(data.totalPaginas)
      setErro("")
    } catch (error) {
      setErro(error.response?.data?.error || "Não foi possível carregar os exercícios.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      carregarExercicios(pagina, busca)
    }, busca ? 300 : 0)

    return () => clearTimeout(timeout)
  }, [pagina, busca])

  function atualizarBusca(event) {
    setBusca(event.target.value)
    setPagina(1)
  }

  function atualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
    setErro("")
    setSucesso("")
  }

  function cancelarEdicao() {
    setExercicioEmEdicao(null)
    setFormulario(formularioInicial)
    setErro("")
    setSucesso("")
  }

  async function salvarExercicio(event) {
    event.preventDefault()
    setSalvando(true)
    setErro("")
    setSucesso("")

    const dados = {
      nome: formulario.nome.trim(),
      video: formulario.video.trim()
    }

    try {
      if (exercicioEmEdicao !== null) {
        await api.put(`/exercicios/${exercicioEmEdicao}`, dados)
        setSucesso("Exercício atualizado com sucesso.")
      } else {
        await api.post("/exercicios", dados)
        setSucesso("Exercício cadastrado com sucesso.")
      }

      cancelarEdicao()
      await carregarExercicios()
    } catch (error) {
      setErro(error.response?.data?.error || "Não foi possível salvar o exercício.")
    } finally {
      setSalvando(false)
    }
  }

  function editarExercicio(exercicio) {
    setExercicioEmEdicao(exercicio.id_exercicio)
    setFormulario({
      nome: exercicio.nome,
      video: exercicio.video || ""
    })
    setErro("")
    setSucesso("")
  }

  async function excluirExercicio(exercicio) {
    if (!window.confirm(`Deseja excluir o exercício "${exercicio.nome}"?`)) return

    setErro("")
    setSucesso("")
    try {
      await api.delete(`/exercicios/${exercicio.id_exercicio}`)
      setSucesso("Exercício excluído com sucesso.")
      await carregarExercicios()
    } catch (error) {
      setErro(error.response?.data?.error || "Não foi possível excluir o exercício.")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#111310] md:pb-0">
      <Aside user={user} setUser={setUser} />

      <main className="min-w-0 flex-1 px-6 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Exercícios</h1>
            <p className="mt-1 text-sm text-[#111310]/50">
              Cadastre e mantenha os exercícios disponíveis para as fichas de treino.
            </p>
          </div>

          <form
            onSubmit={salvarExercicio}
            className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[1fr_2fr_auto]"
          >
            <label className="text-sm font-semibold">
              Nome
              <input
                type="text"
                name="nome"
                maxLength="20"
                required
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder="Ex.: Supino reto"
                className="mt-2 w-full rounded-xl border border-[#111310]/10 px-4 py-3 font-normal outline-none focus:border-[#a6ee1f]"
              />
            </label>
            <label className="text-sm font-semibold">
              Link do vídeo (opcional)
              <input
                type="url"
                name="video"
                maxLength="260"
                value={formulario.video}
                onChange={atualizarCampo}
                placeholder="https://..."
                className="mt-2 w-full rounded-xl border border-[#111310]/10 px-4 py-3 font-normal outline-none focus:border-[#a6ee1f]"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={salvando}
                className="rounded-xl bg-[#a6ee1f] px-5 py-3 text-sm font-bold transition hover:bg-[#95d91b] disabled:opacity-60"
              >
                {salvando ? "Salvando..." : exercicioEmEdicao !== null ? "Salvar" : "Cadastrar"}
              </button>
              {exercicioEmEdicao !== null && (
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="rounded-xl bg-[#111310]/5 px-4 py-3 text-sm font-semibold hover:bg-[#111310]/10"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {erro && (
            <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </p>
          )}
          {sucesso && (
            <p role="status" className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {sucesso}
            </p>
          )}

          <div className="mt-8">
            <label className="text-sm font-semibold">
              Pesquisar por nome
              <input
                type="search"
                value={busca}
                onChange={atualizarBusca}
                placeholder="Digite o nome do exercício"
                className="mt-2 w-full rounded-xl border border-[#111310]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#a6ee1f]"
              />
            </label>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#111310]/10 text-[11px] font-bold uppercase tracking-widest text-[#111310]/50">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Nome</th>
                  <th className="px-5 py-4">Vídeo</th>
                  <th className="px-5 py-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-[#111310]/50">
                      Carregando exercícios...
                    </td>
                  </tr>
                ) : exercicios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-[#111310]/50">
                      Nenhum exercício cadastrado.
                    </td>
                  </tr>
                ) : (
                  exercicios.map((exercicio) => (
                    <tr
                      key={exercicio.id_exercicio}
                      className="border-b border-[#111310]/5 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">{exercicio.id_exercicio}</td>
                      <td className="px-5 py-4 font-semibold">{exercicio.nome}</td>
                      <td className="px-5 py-4">
                        {exercicio.video ? (
                          <a
                            href={exercicio.video}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Abrir vídeo
                          </a>
                        ) : (
                          <span className="text-[#111310]/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editarExercicio(exercicio)}
                            className="rounded-lg px-3 py-2 font-semibold hover:bg-[#a6ee1f]/30"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => excluirExercicio(exercicio)}
                            className="rounded-lg px-3 py-2 font-semibold text-red-700 hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!carregando && (
            <div className="mt-5 flex items-center justify-end gap-3">
              <span className="text-sm text-[#111310]/60">
                Página {pagina} de {Math.max(totalPaginas, 1)}
              </span>
              <button
                type="button"
                disabled={pagina <= 1}
                onClick={() => setPagina((atual) => atual - 1)}
                className="rounded-xl border border-[#111310]/10 px-4 py-2 text-sm font-semibold hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina((atual) => atual + 1)}
                className="rounded-xl border border-[#111310]/10 px-4 py-2 text-sm font-semibold hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
