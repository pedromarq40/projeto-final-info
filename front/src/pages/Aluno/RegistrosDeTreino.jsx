
import { useEffect, useState } from 'react'
import api from '../../api/api.js'
import Aside from '../../components/Aside.jsx'

export default function RegistrosDeTreino({ user, setUser }) {
    const [registros, setRegistros] = useState([])
    const [data, setData] = useState('')
    const [hora, setHora] = useState('')
    const [duracao, setDuracao] = useState('')
    const [mensagem, setMensagem] = useState('')

    async function carregarRegistros() {
        try {
            const resposta = await api.get('/registros-de-treino/meus-registros')
            setRegistros(resposta.data)
        } catch (err) {
            setMensagem(err.response?.data?.error || 'Erro ao carregar registros')
        }
    }

    useEffect(() => {
        carregarRegistros()
    }, [])

    async function registrarTreino(e) {
        e.preventDefault()
        setMensagem('')

        try {
            await api.post('/registros-de-treino/registrar', {
                data_registro: data,
                hora,
                duracao
            })

            setMensagem('Treino registrado com sucesso!')
            setData('')
            setHora('')
            setDuracao('')
            carregarRegistros()
        } catch (err) {
            setMensagem(err.response?.data?.error || 'Erro ao registrar treino')
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

                    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold">Registrar treino</h2>

                        <form onSubmit={registrarTreino}>
                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Data
                                    </label>
                                    <input
                                        type="date"
                                        value={data}
                                        onChange={(e) => setData(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Hora
                                    </label>
                                    <input
                                        type="time"
                                        value={hora}
                                        onChange={(e) => setHora(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Duração
                                    </label>
                                    <input
                                        type="time"
                                        value={duracao}
                                        onChange={(e) => setDuracao(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                Registrar treino
                            </button>
                        </form>

                        {mensagem && (
                            <p className={`mt-4 text-sm font-medium ${
                                mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {mensagem}
                            </p>
                        )}
                    </div>

                    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold">Histórico</h2>

                        {registros.length === 0 ? (
                            <p className="mt-4 text-gray-500">
                                Nenhum treino registrado.
                            </p>
                        ) : (
                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-sm text-gray-500">
                                            <th className="px-4 py-3">Data</th>
                                            <th className="px-4 py-3">Hora</th>
                                            <th className="px-4 py-3">Duração</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {registros.map((registro, index) => (
                                            <tr key={index} className="border-b border-gray-100">
                                                <td className="px-4 py-3">
                                                    {new Date(registro.data_registro).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-4 py-3">{registro.hora}</td>
                                                <td className="px-4 py-3">{registro.duracao}</td>
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
    )
}
