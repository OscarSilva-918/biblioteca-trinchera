import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Book {
  id_libro: number;
  titulo: string;
  isAvailable: boolean;
}
interface Perfil {
  id: string;
  nombre: string;
}

export default function NewLoan() {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<Perfil[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBooks(), fetchUsers()]).then(() => setLoading(false));
  }, []);

  async function fetchBooks() {
    const { data, error } = await supabase
      .from('libros')
      .select('id_libro, titulo, isavailable');
    if (error) toast.error('Error al cargar libros');
    else setBooks(
      (data || []).map(book => ({
        ...book,
        isAvailable: book.isavailable,
      }))
    );
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre, email');
    if (error) toast.error('Error al cargar usuarios');
    else setUsers(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBook || !selectedUser) {
      toast.error('Selecciona libro y usuario');
      return;
    }
    try {
      // Insertar préstamo
      const { error: prestamoError } = await supabase.from('prestamos').insert([
        {
          id_libro: Number(selectedBook),
          id_usuario: selectedUser,
        },
      ]);
      if (prestamoError) throw prestamoError;

      // Marcar libro como no disponible
      await supabase
        .from('libros')
        .update({ isavailable: false })
        .eq('id_libro', selectedBook);

      toast.success('Préstamo registrado exitosamente');
      setSelectedBook('');
      setSelectedUser('');
      fetchBooks(); // Actualiza libros disponibles
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar el préstamo');
    }
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  const availableBooks = books.filter(book => book.isAvailable);
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Registrar nuevo préstamo</h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="book" className="block text-sm font-medium text-gray-700">
                Libro
              </label>
              <select
                id="book"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Seleccionar libro</option>
                {availableBooks.map((book) => (
                  <option key={book.id_libro} value={book.id_libro}>{book.titulo}</option>
                ))}
              </select>
              {books.length > availableBooks.length && (
                <p className="mt-1 text-sm text-gray-500">
                  {books.length - availableBooks.length} libro(s) no disponible(s)
                </p>
              )}
            </div>
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Seleccionar usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Registrar préstamo
          </button>
        </form>
      </div>
    </div>
  );
}