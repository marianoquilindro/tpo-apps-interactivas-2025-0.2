import { useState } from "react";
import { loginUsuario } from "../api/usuariosApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUsuario(email, password);
      console.log("RESPUESTA DEL SERVIDOR:", res);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user))
      
      login(res.token, res.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[400px] border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-[1.02] transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
