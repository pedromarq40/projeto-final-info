import { useEffect, useState } from "react"
import api from "../../api/api.js"
import Aside from "../../components/Aside.jsx"

const formularioInicial = {
  id_plano: "",
  nome: "",
  valor_mensal: "",
}

export default function Planos({ user, setUser }) {
  const [planos, setPlanos] = useState([])
  const [formulario, setFormulario] = useState(formularioInicial)
  const [planoEmEdicao, setPlanoEmEdicao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  async function carregarPlanos() {
    try {
        const { data } = await api.get("/planos")
        setPlanos(data)
        setErro("")
    }catch (error) {
        setErro(error.response?.data?.error || "Não foi possível carregar os planos.")
    }finally {
            setCarregando(false)
        }
    }
  useEffect(() => {
    carregarPlanos()
  }, [])

  function atualizarCampo(event) {
    const { name, value } = event.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
    setErro("")
    setSucesso("")
  }

  function cancelarEdicao() {
    setPlanoEmEdicao(null)
    setFormulario(formularioInicial)
    setErro("")
    setSucesso("")
  }

  async function salvarPlano(event) {
    event.preventDefault()
    setSalvando(true)
    setErro("")
    setSucesso("")

    const dados = {
      nome: formulario.nome.trim(),
      valor_mensal: Number(formulario.valor_mensal),
    }

    try {
      if (planoEmEdicao !== null) {
        await api.put(`/planos/${planoEmEdicao}`, dados)
        setSucesso("Plano atualizado com sucesso.")
      } else {
        await api.post("/planos", {
          ...dados,
          id_plano: Number(formulario.id_plano),
        })
        setSucesso("Plano cadastrado com sucesso.")
      }

      cancelarEdicao()
      await carregarPlanos()
    } catch (error) {
        setErro(error.response?.data?.error || "Não foi possível editar o plano.")
    } finally {
      setSalvando(false)
    }
  }

  function editarPlano(plano) {
    setPlanoEmEdicao(plano.id_plano)
    setFormulario({
      id_plano: plano.id_plano,
      nome: plano.nome,
      valor_mensal: plano.valor_mensal,
    })
    setErro("")
    setSucesso("")
  }

  async function excluirPlano(plano) {
    if (!window.confirm(`Deseja excluir o plano "${plano.nome}"?`)) return

    setErro("")
    setSucesso("")
    try {
      await api.delete(`/planos/${plano.id_plano}`)
      setSucesso("Plano excluído com sucesso.")
      await carregarPlanos()
    } catch (error) {
        setErro(error.response?.data?.error || "Não foi possível excluir o plano.")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] pb-20 text-[#111310] md:pb-0">
      <Aside user={user} setUser={setUser} />

      <main className="min-w-0 flex-1 px-6 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Planos</h1>
            <p className="mt-1 text-sm text-[#111310]/50">
              Gerencie os planos e seus valores mensais.
            </p>
          </div>

          <form
            onSubmit={salvarPlano}
            className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[1fr_2fr_1fr_auto]"
          >
            <label className="text-sm font-semibold">
              ID do plano
              <input
                type="number"
                name="id_plano"
                min="1"
                step="1"
                required
                disabled={planoEmEdicao !== null}
                value={formulario.id_plano}
                onChange={atualizarCampo}
                className="mt-2 w-full rounded-xl border border-[#111310]/10 px-4 py-3 font-normal outline-none focus:border-[#a6ee1f]"
              />
            </label>
            <label className="text-sm font-semibold">
              Nome
              <input
                type="text"
                name="nome"
                maxLength="15"
                required
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder="Ex.: Mensal"
                className="mt-2 w-full rounded-xl border border-[#111310]/10 px-4 py-3 font-normal outline-none focus:border-[#a6ee1f]"
              />
            </label>
            <label className="text-sm font-semibold">
              Valor mensal (R$)
              <input
                type="number"
                name="valor_mensal"
                min="0"
                step="0.01"
                required
                value={formulario.valor_mensal}
                onChange={atualizarCampo}
                placeholder="0,00"
                className="mt-2 w-full rounded-xl border border-[#111310]/10 px-4 py-3 font-normal outline-none focus:border-[#a6ee1f]"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={salvando}
                className="rounded-xl bg-[#a6ee1f] px-5 py-3 text-sm font-bold transition hover:bg-[#95d91b] disabled:opacity-60"
              >
                {salvando ? "Salvando..." : planoEmEdicao !== null ? "Salvar" : "Cadastrar"}
              </button>
              {planoEmEdicao !== null && (
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

          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#111310]/10 text-[11px] font-bold uppercase tracking-widest text-[#111310]/50">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Nome</th>
                  <th className="px-5 py-4">Valor do plano</th>
                  <th className="px-5 py-4">Ativo</th>
                  <th className="px-5 py-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-[#111310]/50">
                      Carregando planos...
                    </td>
                  </tr>
                ) : planos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-[#111310]/50">
                      Nenhum plano cadastrado.
                    </td>
                  </tr>
                ) : (
                  planos.map((plano) => (
                    <tr
                      key={plano.id_plano}
                      className="border-b border-[#111310]/5 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">{plano.id_plano}</td>
                      <td className="px-5 py-4 font-semibold">{plano.nome}</td>
                      <td className="px-5 py-4">
                        {Number(plano.valor_mensal).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-5 py-5">{plano.efetivo === 1? "Sim":"Não"}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editarPlano(plano)}
                            className="rounded-lg px-3 py-2 font-semibold hover:bg-[#a6ee1f]/30"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => excluirPlano(plano)}
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
        </div>
      </main>
    </div>
  )
}