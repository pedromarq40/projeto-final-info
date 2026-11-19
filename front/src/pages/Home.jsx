
import Aside from '../components/Aside.jsx'

export default function Home({ user, setUser }) {
  const primeiroNome = user.nome_completo?.split(" ")[0] || "Aluno"

  const iniciais = user.nome_completo
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("") || "AL"

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#172016]">
      <Aside user={user} setUser={setUser} />

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#172016]/10 bg-white px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs capitalize text-gray-500">{hoje}</p>
            <h1 className="text-xl font-bold">Início</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">{user.nome_completo}</p>
              <p className="text-xs font-medium text-[#5a8a0f]">
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4f2cb] font-bold text-[#5a8a0f]">
              {iniciais}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <section className="relative min-h-[380px] overflow-hidden rounded-3xl bg-[#263b1c] p-8 text-white shadow-lg sm:flex sm:items-center sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#b9df7b]">
                PulsoFit • Sua academia
              </p>

              <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Olá, {primeiroNome}!
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                Bem-vindo ao PulsoFit. Aqui você pode acompanhar sua rotina
                de treinos, consultar suas informações e gerenciar sua
                experiência na academia.
              </p>
            </div>

            <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full border-[45px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-28 right-24 h-64 w-64 rounded-full bg-[#8fbd43]/20 blur-2xl" />

            <div className="pointer-events-none absolute bottom-8 right-10 hidden text-9xl font-black text-white/10 md:block">
              PF
            </div>
          </section>

          <div className="mt-8 rounded-2xl border border-[#dfe5d7] bg-white p-6">
            <p className="text-sm font-semibold text-[#5a8a0f]">
              SUA JORNADA COMEÇA AQUI
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Utilize o menu lateral para navegar pelo sistema.
            </p>
          </div>

          <footer className="mt-10 border-t border-[#172016]/10 pt-6 text-center text-xs text-gray-400">
            PulsoFit © {new Date().getFullYear()} • Gestão de academia
          </footer>
        </main>
      </div>
    </div>
  )
}
