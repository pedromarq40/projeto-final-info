
import { useEffect, useState } from 'react'
import api from '../../api/api.js'
import Aside from '../../components/Aside.jsx'

export default function Mensalidade({ user, setUser }) {
    const [mensalidades, setMensalidades] = useState([])
    const [mensagem, setMensagem] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregarMensalidades() {
        try {
            const resposta = await api.get('/mensalidades/minhas')
            setMensalidades(resposta.data)
        } catch (err) {
            setMensagem(err.response?.data?.error || 'Erro ao carregar mensalidades')
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarMensalidades()
    }, [])

    async function pagarMensalidade(mensalidade) {
        setMensagem('')

        try {
            await api.put('/mensalidades/pagar', {
                data_geracao: mensalidade.data_geracao,
                id_plano: mensalidade.id_plano
            })

            setMensagem('Pagamento registrado com sucesso!')
            carregarMensalidades()
        } catch (err) {
            setMensagem(err.response?.data?.error || 'Erro ao registrar pagamento')
        }
    }

    function formatarData(data) {
        if (!data) return '-'

        const dataFormatada = new Date(data)
        return dataFormatada.toLocaleDateString('pt-BR', {
            timeZone: 'UTC'
        })
    }

    function formatarValor(valor) {
        return Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    return (
        <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
            <Aside user={user} setUser={setUser} />

            <main className="flex-1 px-6 py-10">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold">Minhas mensalidades</h1>

                    <p className="mt-2 text-sm text-[#111310]/60">
                        Consulte suas mensalidades e registre seus pagamentos.
                    </p>

                    {mensagem && (
                        <p className={`mt-5 text-sm font-medium ${
                            mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {mensagem}
                        </p>
                    )}

                    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold">Histórico de mensalidades</h2>

                        {carregando ? (
                            <p className="mt-4 text-gray-500">Carregando...</p>
                        ) : mensalidades.length === 0 ? (
                            <p className="mt-4 text-gray-500">
                                Nenhuma mensalidade encontrada.
                            </p>
                        ) : (
                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-sm text-gray-500">
                                            <th className="px-4 py-3">Plano</th>
                                            <th className="px-4 py-3">Valor</th>
                                            <th className="px-4 py-3">Vencimento</th>
                                            <th className="px-4 py-3">Data do pagamento</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Ação</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {mensalidades.map((mensalidade) => (
                                            <tr key={`${mensalidade.data_geracao}-${mensalidade.id_plano}`} className="border-b border-gray-100">
                                                <td className="px-4 py-3">
                                                    {mensalidade.plano}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {formatarValor(mensalidade.valor)}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {formatarData(mensalidade.vencimento)}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {formatarData(mensalidade.data_pagamento)}
                                                </td>

                                                <td className={`px-4 py-3 font-medium ${
                                                    mensalidade.status === 'paga' ? 'text-green-600' :
                                                        mensalidade.status === 'atrasada' ? 'text-red-600' : 'text-amber-600'
                                                }`}>
                                                    {mensalidade.status === 'paga' ? 'Paga' :
                                                        mensalidade.status === 'atrasada' ? 'Atrasada' : 'Pendente'}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {!mensalidade.data_pagamento && (
                                                        <button
                                                            onClick={() => pagarMensalidade(mensalidade)}
                                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                                        >
                                                            Pagar
                                                        </button>
                                                    )}
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
    )
}
