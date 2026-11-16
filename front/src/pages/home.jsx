import api from '../api/api.js'

const LIME = "#a6ee1f"

const menu = ["Início", "Ficha de treino", "Registros de treino", "Mensalidade"];

const semana = [
  { dia: "SEG", feito: true },
  { dia: "QUA", feito: true },
  { dia: "SEX", feito: true },
  { dia: "SÁB", feito: false },
];

const volume = [
  { dia: "06", valor: 45 },
  { dia: "07", valor: 65 },
  { dia: "08", valor: 57 },
  { dia: "09", valor: 82 },
  { dia: "10", valor: 72 },
  { dia: "11", valor: 100 },
  { dia: "12", valor: 88 },
];

export default function Home({user, setUser }) {

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

  const treinos = semana.filter((s) => s.feito).length
  const meta = semana.length

  return (
    <div className="flex min-h-screen bg-[#f3f5ef] text-[#111310]">
      {/* Menu lateral */}
      <aside className="hidden w-60 flex-col justify-between bg-[#111310] p-5 md:flex">
        <div>
          <div className="mb-10 text-lg font-extrabold tracking-tight">
            <span className="text-[#a6ee1f]">PULSO</span>
            <span className="text-white">FIT</span>
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Área da aluna
          </p>

          <nav className="space-y-1">
            {menu.map((item, i) => (
              <button
                key={item}
                className={`w-full rounded-lg px-3 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                  i === 0
                    ? "bg-[#a6ee1f] text-[#111310]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={async () => {
            try{
                await api.post(`${user.role === "aluno" ? "alunos" : "professores"}/logout`)
            }
            finally{
                setUser(undefined)
                window.location.href = "/login";
            }
          }}
          className="px-3 py-3 text-left text-sm text-white/50 transition-colors hover:text-white"
        >
          Sair
        </button>
      </aside>

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
              <p className="text-sm font-bold">{user.nome}</p>
              <p className="text-xs text-[#5a8a0f]">Aluna</p>
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
              <h2 className="mt-2 text-4xl font-bold tracking-tight">Olá, {primeiroNome}</h2>
              <p className="mt-1 text-sm text-[#111310]/50">Pronta para se superar?</p>
            </div>

            <button
              className="rounded-xl px-6 py-3 text-sm font-bold text-[#111310] shadow-lg shadow-[#a6ee1f]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#a6ee1f]/50"
              style={{ backgroundColor: LIME }}
            >
              Ver minha ficha →
            </button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {/* Treino de hoje */}
            <section className="rounded-2xl bg-[#161815] p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a6ee1f]">
                Treino de hoje
              </p>
              <h3 className="mt-6 text-2xl font-bold">Inferiores A</h3>
              <p className="mt-1 text-sm text-white/50">Foco em força e estabilidade</p>

              <div className="my-6 border-t border-white/10" />

              <div className="flex gap-6 text-xs text-white/50">
                <span>8 exercícios</span>
                <span>52 min</span>
              </div>

              <button className="mt-6 text-sm font-semibold text-[#a6ee1f] transition-all hover:translate-x-1">
                Ver ficha completa →
              </button>
            </section>

            {/* Meta semanal */}
            <section className="rounded-2xl bg-[#dcebb3] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a8a0f]">
                Meta semanal
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#4a7a0a]">Constância gera resultado.</h3>

              <div className="mt-6 flex items-center gap-5">
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#6b9a14 ${(treinos / meta) * 360}deg, #f3f5ef 0deg)`,
                  }}
                >
                  <div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-[#dcebb3]">
                    <span className="text-xl font-bold leading-none">
                      {treinos}
                      <span className="text-xs text-[#5a8a0f]">/{meta}</span>
                    </span>
                    <span className="text-[9px] text-[#5a8a0f]">treinos</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold">Você está no ritmo!</p>
                  <p className="mt-1 text-xs text-[#4a7a0a]">
                    Falta só mais um treino para bater sua meta.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between px-2">
                {semana.map((s) => (
                  <div key={s.dia} className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 ${
                        s.feito ? "bg-[#6b9a14] text-white" : "border border-[#6b9a14]/40"
                      }`}
                    >
                      {s.feito && "✓"}
                    </div>
                    <span className="text-[9px] text-[#5a8a0f]">{s.dia}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Evolução */}
            <section className="rounded-2xl bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#111310]/50">
                    Evolução
                  </p>
                  <h3 className="mt-1 text-lg font-bold">Seu volume de treino</h3>
                </div>
                <span className="text-xs font-bold text-[#5a8a0f]">↑ 12%</span>
              </div>

              <div className="mt-6 flex h-32 items-end gap-3">
                {volume.map((v, i) => {
                  const destaque = i === volume.length - 2;
                  return (
                    <div key={v.dia} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className={`w-full rounded-sm transition-all duration-300 hover:opacity-70 ${
                          destaque ? "bg-[#a6ee1f]" : "bg-[#dfe5d6]"
                        }`}
                        style={{ height: `${v.valor}%` }}
                      />
                      <span className="text-[9px] text-[#111310]/40">{v.dia}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recado do professor */}
            <section className="rounded-2xl bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111310]/50">
                Recado do professor
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                “Aumente um pouco a carga hoje, mas mantenha o movimento controlado. Você está
                evoluindo muito bem!”
              </p>

              <div className="mt-5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dff0b8] text-[9px] font-bold text-[#5a8a0f]">
                  RC
                </div>
                <span className="text-xs text-[#111310]/50">Rafael Costa · há 2h</span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}