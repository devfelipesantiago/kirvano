const API_URL = "http://localhost:3001";

export const authService = {
  login: async (loginData) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido." }));
      throw new Error(errorData.message || "Erro desconhecido ao fazer login.");
    }

    const data = await response.json();
    return { data };
  },

  register: async (registerData) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido." }));
      throw new Error(errorData.message || "Erro desconhecido ao registrar.");
    }

    const data = await response.json();
    return { data };
  },

  getUserProfile: async (token) => {
    const response = await fetch(`${API_URL}/users/profiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido." }));
      throw new Error(errorData.message || "Erro ao carregar perfil.");
    }

    const data = await response.json();
    return { data };
  },
};
