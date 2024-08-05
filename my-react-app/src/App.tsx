import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import HomeEmpleado from "./page/homeempleado";
import Admin from "./page/Admin";
import Empleados from "./page/empleados"; // Asegúrate de que la ruta sea correcta

const App: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRole = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found");
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<{ role: string }>(
        'http://192.168.0.16:5000/api/verify-role',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRole(response.data.role);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to verify role:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      setRole(null); // No se pudo verificar el rol, redirigir al login
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const handleLogin = async (role: string, username: string) => {
    localStorage.setItem("role", role);
    localStorage.setItem("username", username); // Guardar username para futuras consultas
    await fetchRole(); // Actualizar el rol después del login
  };

  if (loading) {
    return <div>Loading...</div>; // Mostrar un mensaje de carga mientras se valida el rol
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={role ? <Navigate to={`/${role}`} /> : <Login onLogin={handleLogin} />}
      />
      <Route
        path="/admin"
        element={role === "admin" ? <Admin /> : <Navigate to="/login" />}
      />
      <Route
        path="/empleados"
        element={role === "admin" ? <Empleados /> : <Navigate to="/login" />}
      />
      <Route
        path="/employee"
        element={role === "employee" ? <HomeEmpleado /> : <Navigate to="/login" />}
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
