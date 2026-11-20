
import { useEffect, useState } from 'react'
import api from '../../api/api.js'
import Aside from '../../components/Aside.jsx'

export default function FichaDeTreino({ user, setUser }) {
    const [ficha, setFicha] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarFicha() {
            try {
                const resposta = await api.get('/fichas-de-treino/minha-ficha')
                setFicha(resposta.data)
            } catch (error) {
                if (error.response?.status === 404) {
                    setErro('Você ainda não possui uma ficha de treino.')
                } else {
                    setErro('Erro ao carregar sua ficha de treino.')
                }
                console.log(error.response?.data)
            } finally {
                setCarregando(false)
            }
        }

        carregarFicha()
    }, [])

    const dadosFicha = ficha[0]

    return (
        <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
            <Aside user={user} setUser={setUser} />

            <main className="flex-1 px-6 py-10">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold">Ficha de treino</h1>

                    <p className="mt-2 text-sm text-[#111310]/60">
                        Consulte seus exercícios e orientações de treino.
                    </p>

                    {carregando ? (
                        <p className="mt-8">Carregando ficha...</p>
                    ) : erro ? (
                        <p className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                            {erro}
                        </p>
                    ) : (
                        <>
                            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold">
                                    Informações da ficha
                                </h2>

                                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Foco</p>
                                        <p className="font-semibold">
                                            {dadosFicha?.foco || 'Não informado'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Tipo</p>
                                        <p className="font-semibold">
                                            {dadosFicha?.tipo || 'Não informado'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Validade</p>
                                        <p className="font-semibold">
                                            {dadosFicha?.validade
                                                ? new Date(dadosFicha.validade).toLocaleDateString('pt-BR')
                                                : 'Não informada'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h2 className="mt-8 text-xl font-bold">
                                Exercícios
                            </h2>

                            <div className="mt-4 space-y-4">
                                {ficha.map((item, index) => (
                                    <div
                                        key={item.id_exercicio || index}
                                        className="rounded-2xl bg-white p-6 shadow-sm"
                                    >
                                        <h3 className="text-lg font-bold">
                                            {item.exercicio || 'Exercício não informado'}
                                        </h3>

                                        <div className="mt-4 grid grid-cols-3 gap-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Séries</p>
                                                <p className="font-semibold">
                                                    {item.series ?? '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">Repetições</p>
                                                <p className="font-semibold">
                                                    {item.repeticoes ?? '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">Carga</p>
                                                <p className="font-semibold">
                                                    {item.carga != null ? `${item.carga} kg` : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        {item.video && (
                                            <a
                                                href={item.video}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
                                            >
                                                Ver vídeo do exercício
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
