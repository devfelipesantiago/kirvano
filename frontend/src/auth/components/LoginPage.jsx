import React, { useState } from "react";
import { authService } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authService.login({ email, password });
      if (data && data.token) {
        setMessage("Login realizado com sucesso!");
        login(data.token, email);
      } else {
        throw new Error("Token de autenticação não encontrado na resposta.");
      }
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <section className="section-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            className="form-control"
            type="email"
            id="email"
            value={email}
            placeholder="Digite seu e-mail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            className="form-control"
            type="password"
            id="password"
            value={password}
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn" type="submit">
          Entrar
        </button>
      </form>
      {message && (
        <p
          style={{
            color: message.includes("Erro")
              ? "var(--error-color)"
              : "var(--success-color)",
          }}
        >
          {"Usuário ou senha inválidos"}
        </p>
      )}
    </section>
  );
};

export default LoginPage;
