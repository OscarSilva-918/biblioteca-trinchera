import React, { useState } from "react";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Para redirigir después del inicio de sesión
  const { login } = useAuth(); // Contexto de autenticación

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Intentar iniciar sesión con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Si hay un error o el usuario no existe
    if (error) {
      if (error.message === "Invalid login credentials") {
        toast.error("Credenciales incorrectas. Por favor, verifica tu correo y contraseña o registrate");
      } else if (error.message === "User not found") {
        toast.error(
          <span>
            No se encontró una cuenta con este correo.{" "}
            <Link to="/register" className="text-indigo-600 underline">
              Regístrate aquí
            </Link>
          </span>
        );
      } else {
        toast.error("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
      }
      return; // Detener la ejecución si hay un error
    }

    if (!data.user) {
      toast.error("Inicio de sesión fallido. Por favor, inténtalo de nuevo.");
      return;
    }

    // Guardar el usuario en el contexto de autenticación
    login({
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || "usuario",
    });

    // Verificar si el perfil existe en la tabla "Perfiles"
    const { data: perfilExistente, error: perfilError } = await supabase
      .from("Perfiles")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (perfilError && perfilError.code !== "PGRST116") {
      throw new Error("Error al verificar el perfil.");
    }

    // Si no existe un perfil, crearlo
    if (!perfilExistente) {
      const { error: insertError } = await supabase.from("Perfiles").insert([
        {
          id: data.user.id,
          nombre: "Nombre Por Defecto", // Puedes personalizar esto
          rol: "usuario", // Rol por defecto
        },
      ]);

      if (insertError) {
        console.error("Error al crear el perfil:", insertError.message);
        throw new Error("Error al crear el perfil.");
      }
    }

    // Mostrar mensaje de éxito y redirigir
    toast.success("Inicio de sesión exitoso");
    navigate("/");
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Ocurrió un error inesperado.");
  }
};
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar sesión
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Registrarse
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
