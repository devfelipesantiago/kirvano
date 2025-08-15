import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/context/AuthContext.jsx";
import { authService } from "../auth/services/authService.js";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setLoading(false);
        setError("Token de usuário não encontrado.");
        return;
      }

      try {
        const { data } = await authService.getUserProfile(user.token);
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <section className="section-card">Carregando perfil...</section>;
  }

  if (error) {
    return (
      <section className="section-card" style={{ color: "var(--error-color)" }}>
        Erro ao carregar perfil: {error}
      </section>
    );
  }

  if (!profileData) {
    return (
      <section className="section-card">
        Nenhum dado de perfil encontrado.
      </section>
    );
  }

  return (
    <section className="section-card">
      <h2>Meu Perfil</h2>
      <div>
        <p>
          <strong>Nome:</strong> {profileData[0].name}
        </p>
        <p>
          <strong>E-mail:</strong> {profileData[0].email}
        </p>
      </div>
    </section>
  );
};

export default ProfilePage;
