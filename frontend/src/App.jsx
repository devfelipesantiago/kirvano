import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './auth/components/RegisterPage.jsx';
import LoginPage from './auth/components/LoginPage.jsx';
import PokemonList from './external-api/components/PokemonList.jsx';
import './App.css';
import { useAuth } from './auth/context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import ProfilePage from './ProfilePage.jsx';

const HomePage = () => {
  return (
    <div className="section-card">
      <h2>Bem-vindo à Kirvano</h2>
      <p>Faça o login ou cadastro no menu acima.</p>
    </div>
  );
};

function App() {
  const { user, logout } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="App">
      <header className="header">
        <h1>Kirvano social media</h1>
        <div className="hamburger" onClick={() => setIsNavOpen(!isNavOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <nav className={`nav-links ${isNavOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setIsNavOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to="/pokemons" onClick={() => setIsNavOpen(false)}>Pokemons</Link>
              <Link to="/profile" onClick={() => setIsNavOpen(false)}>Perfil</Link>
              <button className="btn btn-secondary" onClick={() => { logout(); setIsNavOpen(false); }}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsNavOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsNavOpen(false)}>Registro</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/pokemons"
            element={
              <ProtectedRoute>
                <PokemonList />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;