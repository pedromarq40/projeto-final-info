
import { useState } from 'react';
import api from '../api/api.js'
import { useNavigate } from 'react-router-dom';

const inputClass = "w-full rounded-xl border border-transparent bg-white px-4 py-3.5 text-sm text-[#111310] shadow-sm outline-none placeholder:text-[#111310]/40 focus:border-[#a6ee1f] focus:shadow-[0_0_0_4px_rgba(166,238,31,0.25)]";

const onlyDigits = (value) => value.replace(/\D/g, "");

export default function Cadastro() {
  const navigate = useNavigate()

  const [role, setRole] = useState("aluno");
  const [form, setForm] = useState({
    nome_completo: "",
    CPF: "",
    email: "",
    telefone: "",
    senha: "",
    // aluno
   altura: "",
   peso: "",
    problemas_saude: "",
    // professor
    especializacao: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    const cleaned = name === "CPF" || name === "telefone" ? onlyDigits(value) : value;
    setForm((prev) => ({ ...prev, [name]: cleaned }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const base = {
      nome_completo: form.nome_completo,
      CPF: form.CPF,
      email: form.email,
      telefone: form.telefone,
      senha: form.senha,
    };

    const dados =
      role === "aluno"
        ? { ...base, altura: form.altura, peso: form.peso, problemas_saude: form.problemas_saude }
        : { ...base, especializacao: form.especializacao };

    try {
      await api.post(`/${role === "aluno" ? "alunos" : "professores"}/cadastro`, dados)
      alert("Cadastro concluído com sucesso!")
      navigate("/login")
    } catch (error) {
      console.log(error.response?.status)
      console.log(error.response?.data)
      alert("Erro no cadastro")
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Lado esquerdo */}
      <aside className="relative hidden items-center overflow-hidden bg-[#111310] p-16 lg:flex">

        <div className="relative">
          <div className="mb-12 text-xl font-extrabold tracking-tight">
            <span className="text-[#a6ee1f]">PULSO</span>
            <span className="text-white">FIT</span>
          </div>

          <h1 className="text-6xl font-bold leading-[1.05] tracking-tight text-white">
            Comece sua
            <br />
            <span className="bg-gradient-to-r from-[#a6ee1f] to-[#5fd35f] bg-clip-text text-transparent">
              jornada.
            </span>
          </h1>
        </div>
      </aside>

      {/* Lado direito */}
      <main className="flex items-center justify-center bg-[#f3f5ef] px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-4xl font-bold tracking-tight text-[#111310]">
            Criar conta
          </h2>
          <p className="mt-2 text-sm text-[#111310]/50">
            Preencha seus dados para começar.
          </p>

          {/* Perfil */}
          <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-[#e6eae0] p-1">
            {[
              ["aluno", "Aluno"],
              ["professor", "Professor"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`rounded-lg py-3 text-sm font-semibold ${
                  role === value
                    ? "bg-white text-[#111310] shadow-md"
                    : "text-[#111310]/50 hover:text-[#111310]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <input
              name="nome_completo"
              required
              maxLength={40}
              value={form.nome_completo}
              onChange={handleChange}
              placeholder="Nome completo"
              className={inputClass}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="CPF"
                required
                inputMode="numeric"
                minLength={11}
                maxLength={11}
                value={form.CPF}
                onChange={handleChange}
                placeholder="CPF"
                className={inputClass}
              />
              <input
                name="telefone"
                required
                inputMode="numeric"
                maxLength={11}
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className={inputClass}
              />
            </div>

            <input
              name="email"
              type="email"
              required
              maxLength={35}
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail"
              className={inputClass}
            />

            <input
              name="senha"
              type="password"
              required
              minLength={6}
              value={form.senha}
              onChange={handleChange}
              placeholder="Senha"
              className={inputClass}
            />

            {/* Campos do aluno */}
            {role === "aluno" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="altura"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999.99"
                    value={form.altura}
                    onChange={handleChange}
                    placeholder="Altura (m)"
                    className={inputClass}
                  />
                  <input
                    name="peso"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999.99"
                    value={form.peso}
                    onChange={handleChange}
                    placeholder="Peso (kg)"
                    className={inputClass}
                  />
                </div>
                <input
                  name="problemas_saude"
                  maxLength={50}
                  value={form.problemas_saude}
                  onChange={handleChange}
                  placeholder="Problemas de saúde (opcional)"
                  className={inputClass}
                />
              </>
            )}

            {/* Campo do professor */}
            {role === "professor" && (
              <input
                name="especializacao"
                required
                maxLength={20}
                value={form.especializacao}
                onChange={handleChange}
                placeholder="Especialização"
                className={inputClass}
              />
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#a6ee1f] py-4 text-sm font-bold text-[#111310] shadow-lg shadow-[#a6ee1f]/30"
          >
            Criar conta
          </button>

          <p className="mt-6 text-center text-sm text-[#111310]/50">
            Já tem conta?{" "}
            <a
              href="/login"
              className="font-semibold text-[#5a8a0f] hover:text-[#111310]"
            >
              Entrar
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
