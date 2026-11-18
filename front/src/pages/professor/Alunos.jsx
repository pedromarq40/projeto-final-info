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
};

const vazio = (valor, sufixo = "") =>
  valor === null || valor === undefined || valor === "" ? "—" : `${valor}${sufixo}`

export default function Alunos({ user, setUser }) {
  const [alunos, setAlunos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [busca, setBusca] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const {data} = await api.get("/alunos")
        setAlunos(data)
      } catch (error) {
        setErro(error.response?.data?.error || "Não foi possível carregar os alunos.")
      } finally {
        setCarregando(false)
      }
    }
    carregar();
  }, []);

  const termo = busca.trim().toLowerCase()
  const filtrados = alunos.filter(
    (a) =>
      a.nome_completo?.toLowerCase().includes(termo) ||
      a.email?.toLowerCase().includes(termo)
  );

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

          {erro && (
            <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
          )}

          {!carregando && !erro && filtrados.length === 0 && (
            <p className="mt-8 rounded-xl bg-white px-4 py-10 text-center text-sm text-[#111310]/50 shadow-sm">
              Nenhum aluno encontrado.
            </p>
          )}

          {filtrados.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[900px] text-left text-sm">
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
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((a) => (
                    <tr
                      key={a.CPF}
                      className="border-b border-[#111310]/5 transition-colors last:border-0 hover:bg-gray-100"
                    >
                      <td className="px-5 py-4 font-semibold">{a.nome_completo}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{formatarCPF(a.CPF)}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{a.email}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{formatarTelefone(a.telefone)}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{vazio(a.altura, " m")}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{vazio(a.peso, " kg")}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{vazio(a.problemas_saude)}</td>
                      <td className="px-5 py-4 text-[#111310]/70">{formatarData(a.data_criacao)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}