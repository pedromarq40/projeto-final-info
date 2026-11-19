
import { useEffect, useState } from 'react'
import api from '../../api/api.js'
import Aside from '../../components/Aside.jsx'

export default function MeusDados({ user, setUser }) {
  const [dados, setDados] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    altura: '',
    peso: '',
    problemas_saude: ''
  })

  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const resposta = await api.get('/alunos/meus-dados')
        setDados({
          nome_completo: resposta.data.nome_completo || '',
          email: resposta.data.email || '',
          telefone: resposta.data.telefone || '',
          altura: resposta.data.altura ?? '',
          peso: resposta.data.peso ?? '',
          problemas_saude: resposta.data.problemas_saude || ''
        })
      } catch (error) {
        alert('Erro ao carregar seus dados.')
        console.log(error.response?.data)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    setDados({
      ...dados,
      [name]: value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await api.put('/alunos/meus-dados', dados)
      alert('Dados atualizados com sucesso!')
    } catch (error) {
      console.log(error.response?.data)
      alert('Erro ao atualizar os dados.')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
      <Aside user={user} setUser={setUser} />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Meus dados</h1>
          <p className="mt-2 text-sm text-[#111310]/60">
            Consulte e atualize suas informações pessoais.
          </p>

          {carregando ? (
            <p className="mt-8">Carregando dados...</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nome completo
                </label>
                <input
                  name="nome_completo"
                  value={dados.nome_completo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={dados.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Telefone
                </label>
                <input
                  name="telefone"
                  value={dados.telefone}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Altura (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="altura"
                    value={dados.altura}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="peso"
                    value={dados.peso}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Problemas de saúde
                </label>
                <textarea
                  name="problemas_saude"
                  value={dados.problemas_saude}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#a6ee1f] py-3 font-bold text-[#111310] hover:bg-[#95d91b]"
              >
                Salvar alterações
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
