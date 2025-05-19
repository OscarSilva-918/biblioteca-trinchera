import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { LoanRow } from '../types'; // Importa el tipo desde tu archivo de tipos

export default function LoanList() {
  const [loans, setLoans] = useState<LoanRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLoans() {
    setLoading(true);
    const { data, error } = await supabase
      .from('prestamos')
      .select(`
        id_prestamo,
        fecha_prestamo,
        fecha_devolucion,
        perfiles (nombre),
        libros (titulo)
      `)
      .order('fecha_prestamo', { ascending: false });

    if (error) {
      toast.error('Error al cargar los préstamos');
      console.error(error);
    } else {
      const normalized = (data || []).map((loan) => ({
        ...loan,
        perfiles: Array.isArray(loan.perfiles) ? loan.perfiles[0] || null : loan.perfiles,
        libros: Array.isArray(loan.libros) ? loan.libros[0] || null : loan.libros,
      }));
      setLoans(normalized);
    }
    setLoading(false);
  }

  async function handleReturn(loanId: number) {
    try {
      const { error } = await supabase
        .from('prestamos')
        .update({ fecha_devolucion: new Date().toISOString().slice(0, 10) })
        .eq('id_prestamo', loanId);

      if (error) throw error;

      toast.success('Libro marcado como devuelto');
      fetchLoans();
    } catch (error) {
      toast.error('Error al actualizar el préstamo');
    }
  }

  // Filtro por nombre de libro o usuario
  const filteredLoans = loans.filter(
    (loan) =>
      (loan.libros?.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.perfiles?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título de libro o nombre de usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha préstamo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha devolución</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLoans.map((loan) => {
              const isReturned = !!loan.fecha_devolucion;
              return (
                <tr key={loan.id_prestamo}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.perfiles?.nombre || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.libros?.titulo || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.fecha_prestamo ? format(new Date(loan.fecha_prestamo), 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isReturned
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isReturned ? 'Devuelto' : 'Prestado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.fecha_devolucion ? format(new Date(loan.fecha_devolucion), 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {!isReturned && (
                      <button
                        onClick={() => handleReturn(loan.id_prestamo)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marcar devuelto
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}