import Aside from '../components/Aside.jsx'

export default function Home({ user, setUser }) {

  const primeiroNome = user["nome_completo"].split(" ")[0]
  const iniciais = user["nome_completo"]
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
      <Aside user={user} setUser={setUser}/>

      {/* Conteúdo */}
      <div className="flex-1">
        {/* Topo */}
        <header className="flex items-center justify-between border-b border-[#111310]/10 px-8 py-5">
          <div>
            <p className="text-xs capitalize text-[#111310]/50">{hoje}</p>
            <h1 className="text-xl font-bold">Início</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">{user.nome_completo}</p>
              <p className="text-xs text-[#5a8a0f]">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff0b8] text-sm font-bold text-[#5a8a0f]">
              {iniciais}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-10">
          {/* Saudação */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase capitalize tracking-widest text-[#111310]/50">
                {hoje}
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                Olá, {primeiroNome}
              </h2>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
