import { useNavigate } from "react-router-dom";

export default function NotFound({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#f3f5ef] px-6 py-8 text-[#111310]">

      <main className="mx-auto my-auto flex max-w-lg flex-col items-center text-center">
        <div className="relative mb-6 select-none">
          <span className="text-[120px] font-black leading-none tracking-tighter text-[#111310] sm:text-[150px]">
            404
          </span>
          <div className="mx-auto -mt-3 flex h-8 w-44 items-center justify-center rounded-full bg-[#111310] px-4 shadow-md">
            <svg
              viewBox="0 0 120 24"
              fill="none"
              className="h-4 w-full stroke-[#a6ee1f]"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h28l8-9 10 18 10-14 6 5h54" />
            </svg>
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[#5a8a0f]">
          Fora de rota
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Essa página pulou o treino de hoje
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[#111310]/60">
          O endereço que você tentou acessar não existe, foi movido ou está
          temporariamente indisponível.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(user ? "/" : "/login")}
            className="rounded-xl bg-[#a6ee1f] px-6 py-3.5 text-sm font-bold text-[#111310] shadow-sm transition-all duration-200 hover:brightness-95 active:scale-[0.98]"
          >
            {user ? "Voltar para o início" : "Ir para o login"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-[#111310]/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#111310] transition-colors hover:bg-[#111310]/5"
          >
            Página anterior
          </button>
        </div>
      </main>

      <footer className="text-center text-xs text-[#111310]/40">
        PULSOFIT • Sistema de Gestão de Treinos
      </footer>
    </div>
  );
}