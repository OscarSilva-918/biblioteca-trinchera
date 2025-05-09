import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Mostrar el indicador de carga

    try {
      // Intentar registrar al usuario con Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error(error);
        toast.error('Error al registrarse');
        setLoading(false); // Ocultar el indicador de carga
        return;
      }

      const user = data.user;

      if (!user) {
        toast.error('No se pudo obtener el usuario registrado');
        setLoading(false); // Ocultar el indicador de carga
        return;
      }

      // Insertar perfil en la tabla "Perfiles"
      const { error: perfilError } = await supabase.from('Perfiles').insert({
        id: user.id,
        nombre,
        rol: 'usuario', // Rol por defecto
      });

      if (perfilError) {
        console.error(perfilError);
        toast.error('Error al crear perfil');
        setLoading(false); // Ocultar el indicador de carga
        return;
      }

      // Mostrar mensaje de éxito
      toast.success('Registro exitoso. Verifica tu correo para confirmar tu cuenta.');

      // Esperar a que el usuario confirme su correo
      const interval = setInterval(async () => {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session) {
          clearInterval(interval); // Detener el intervalo
          toast.success('Correo confirmado. Redirigiendo...');
          setLoading(false); // Ocultar el indicador de carga
          navigate('/'); // Redirigir a la pantalla principal
        }
      }, 3000); // Verificar cada 3 segundos
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error inesperado');
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear cuenta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading} // Deshabilitar el botón mientras se carga
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Cargando...' : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrarse
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}