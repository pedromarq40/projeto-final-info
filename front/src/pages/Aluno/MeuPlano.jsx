
import { useEffect, useState } from 'react'
import api from '../../api/api.js'
import Aside from '../../components/Aside.jsx'

export default function MeuPlano({ user, setUser }) {
    const [assinatura, setAssinatura] = useState(null)
    const [planos, setPlanos] = useState([])
    const [planoSelecionado, setPlanoSelecionado] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregarDados() {
        try {
            const respostaPlanos = await api.get('/planos')
            const respostaAssinatura = await api.get('/assinaturas/minha')

            setPlanos(respostaPlanos.data.filter(plano => plano.efetivo))
            setAssinatura(respostaAssinatura.data[0] || null)
        } catch (err) {
            setMensagem(err.response?.data?.error || 'Erro ao carregar planos')
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarDados()
    }, [])

    async function trocarPlano(e) {
        e.preventDefault()
        setMensagem('')

        if (!planoSelecionado) {
            setMensagem('Selecione um plano.')
            return
        }

        try {
            await api.put('/assinaturas/trocar', {
                id_plano: Number(planoSelecionado)
            })

            setMensagem('Assinatura atualizada com sucesso!')
            setPlanoSelecionado('')
            carregarDados()
        } catch (err) {
            setMensagem(err.response?.data?.error || 'Erro ao atualizar assinatura')
        }
    }

    function formatarValor(valor) {
        return Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    function formatarData(data) {
        if (!data) return '-'

        return new Date(data).toLocaleDateString('pt-BR', {
            timeZone: 'UTC'
        })
    }

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
                        <p className={`mt-5 text-sm font-medium ${
                            mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-600'
                        }`}>
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
                                            <strong>Valor mensal:</strong> {formatarValor(assinatura.valor_mensal)}
                                        </p>

                                        <p>
                                            <strong>Data da assinatura:</strong> {formatarData(assinatura.data_assinatura)}
                                        </p>

                                        <p>
                                            <strong>Vencimento:</strong> {formatarData(assinatura.data_vencimento)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-4 text-gray-500">
                                        Você ainda não possui uma assinatura.
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold">Escolher ou trocar de plano</h2>

                                {planos.length === 0 ? (
                                    <p className="mt-4 text-gray-500">
                                        Nenhum plano disponível.
                                    </p>
                                ) : (
                                    <form onSubmit={trocarPlano}>
                                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                            {planos.map(plano => (
                                                <label
                                                    key={plano.id_plano}
                                                    className={`cursor-pointer rounded-xl border p-5 ${
                                                        String(planoSelecionado) === String(plano.id_plano)
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-200'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="plano"
                                                        value={plano.id_plano}
                                                        checked={String(planoSelecionado) === String(plano.id_plano)}
                                                        onChange={(e) => setPlanoSelecionado(e.target.value)}
                                                        className="mr-2"
                                                    />

                                                    <span className="font-bold">{plano.nome}</span>

                                                    <p className="mt-3 text-lg font-semibold">
                                                        {formatarValor(plano.valor_mensal)}
                                                    </p>
                                                </label>
                                            ))}
                                        </div>

                                        <button
                                            type="submit"
                                            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                                        >
                                            Confirmar plano
                                        </button>
                                    </form>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
