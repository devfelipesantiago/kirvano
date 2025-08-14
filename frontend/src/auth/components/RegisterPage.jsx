import React, { useState } from 'react';
import { authService } from '../services/authService.js';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const { data } = await authService.register({name, email, password});
      setSuccessMessage('Registro realizado com sucesso!');
      console.log('Registro realizado com sucesso!', data);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Erro ao registrar usuário.');
    }
  };

  return (
    <section className="section-card">
      <h2>Registro</h2>
      {error && <p style={{ color: 'var(--error-color)' }}>{error}</p>}
      {successMessage && <p style={{ color: 'var(--success-color)' }}>{successMessage}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            className="form-control"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            className="form-control"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            className="form-control"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit">Registrar</button>
      </form>
    </section>
  );
};

export default RegisterPage;