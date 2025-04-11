import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle, Search } from 'lucide-react';
import { loansApi } from '../lib/db';
import { Loan } from '../types';
import toast from 'react-hot-toast';

export default function LoanList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const data = await loansApi.list();
      setLoans(data);
    } catch (error) {
      toast.error('Error al cargar los préstamos');
    } finally {
      setLoading(false);
    }
  }

  async function handleReturn(loanId: string) {
    try {
      await loansApi.update(loanId, {
        is_returned: true,
        return_date: new Date().toISOString()
      });
      toast.success('Libro marcado como devuelto');
      fetchLoans();
    } catch (error) {
      toast.error('Error al actualizar el préstamo');
    }
  }

  const filteredLoans = loans.filter(loan => 
    loan.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredLoans.map((loan) => (
              <tr key={loan.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.user?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.book?.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(loan.loan_date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    loan.is_returned 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {loan.is_returned ? 'Devuelto' : 'Prestado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.return_date ? format(new Date(loan.return_date), 'dd/MM/yyyy') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {!loan.is_returned && (
                    <button
                      onClick={() => handleReturn(loan.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar devuelto
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}