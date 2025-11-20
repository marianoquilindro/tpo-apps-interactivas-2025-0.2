const API_URL = "http://localhost:4000/api";

export interface LoginResponse {
  token: string;
  user:{
    id: number;
    email: string;
    nombre: string;
  };
}

export async function loginUsuario(email: string, password: string) {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const data: LoginResponse = await response.json();
  return data;
}
