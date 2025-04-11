import React, { useState, useEffect } from 'react';
import { Book as BookIcon, Clock, Eye } from 'lucide-react';
import { booksApi, loansApi, bookCategories } from '../lib/db';
import { Book, Loan } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import BookModal from './BookModal';
import { useNavigate, useParams } from 'react-router-dom';

const categoryBackgrounds = {
  'Teología': 'bg-gradient-to-br from-blue-500 to-blue-700',
  'Vida Cristiana': 'bg-gradient-to-br from-green-500 to-green-700',
  'Apologética': 'bg-gradient-to-br from-purple-500 to-purple-700',
  'Estudios Bíblicos': 'bg-gradient-to-br from-yellow-500 to-yellow-700',
  'Devocional': 'bg-gradient-to-br from-pink-500 to-pink-700',
  'Historia de la Iglesia': 'bg-gradient-to-br from-red-500 to-red-700',
  'Ministerio': 'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'Evangelismo': 'bg-gradient-to-br from-orange-500 to-orange-700'
};

export default function UserDashboard() {
  const [books, setBooks] = useState<(Book & { isAvailable: boolean })[]>([]);
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<(Book & { isAvailable: boolean }) | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    if (user) {
      Promise.all([fetchBooks(), fetchUserLoans()]).then(() => setLoading(false));
    }
  }, [user]);

  async function fetchBooks() {
    try {
      const data = await booksApi.list();
      setBooks(data);
    } catch (error) {
      toast.error('Error al cargar los libros');
    }
  }

  async function fetchUserLoans() {
    if (!user) return;
    try {
      const data = await loansApi.listByUser(user.id);
      setUserLoans(data);
    } catch (error) {
      toast.error('Error al cargar los préstamos');
    }
  }

  async function handleBorrow(bookId: string) {
    if (!user) return;
    try {
      await loansApi.create({
        book_id: bookId,
        user_id: user.id,
        loan_date: new Date().toISOString()
      });
      toast.success('Libro reservado exitosamente');
      fetchBooks();
      fetchUserLoans();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al reservar el libro');
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const activeLoans = userLoans.filter(loan => !loan.is_returned);

  // Show categories view
  if (!category) {
    return (
      <div className="space-y-8">
        {/* User's current loans */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Mis préstamos actuales
            </h3>
            <div className="space-y-4">
              {activeLoans.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <BookIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">No tienes préstamos activos</p>
                </div>
              ) : (
                activeLoans.map(loan => (
                  <div
                    key={loan.id}
                    className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg transform transition-all duration-300 hover:scale-102 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookIcon className="h-5 w-5 text-indigo-600 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {loan.book?.title}
                          </h4>
                          <p className="text-sm text-gray-500">{loan.book?.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-indigo-500 mr-1" />
                        <span className="text-sm text-gray-600">
                          Prestado el {new Date(loan.loan_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Explorar por categoría
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookCategories.map((cat) => {
                const categoryBooks = books.filter(book => book.category === cat);
                const availableBooks = categoryBooks.filter(b => b.isAvailable);
                
                return (
                  <div
                    key={cat}
                    onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                    className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className={`absolute inset-0 ${categoryBackgrounds[cat]} opacity-90`}></div>
                    <div className="relative p-6">
                      <div className="flex items-center justify-between">
                        <BookIcon className="h-8 w-8 text-white" />
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                          {categoryBooks.length} libros
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-white">{cat}</h3>
                      <p className="mt-2 text-sm text-white text-opacity-90">
                        {categoryBooks.length === 0
                          ? 'No hay libros en esta categoría'
                          : `${availableBooks.length} disponibles`}
                      </p>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show books for selected category
  const filteredBooks = books.filter(book => book.category === category);

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900 transition-colors duration-300"
        >
          ← Volver a categorías
        </button>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">{category}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative">
              <div className={`absolute inset-0 ${categoryBackgrounds[book.category]} opacity-10`}></div>
              <img
                src={book.imageUrls[0]}
                alt={book.title}
                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                {book.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500">{book.author}</p>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryBackgrounds[book.category]} text-white`}>
                {book.category}
              </span>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  book.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.isAvailable ? 'Disponible' : 'Prestado'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver detalles
                  </button>
                  {book.isAvailable && (
                    <button
                      onClick={() => handleBorrow(book.id)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                    >
                      Reservar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}