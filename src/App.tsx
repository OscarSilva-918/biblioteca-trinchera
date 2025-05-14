import { Toaster } from 'react-hot-toast';
import { Book, Library, Users, Search, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import UserList from './components/UserList';
import LoanList from './components/LoanList';
import NewLoan from './components/NewLoan';
import LoginForm from './components/LoginForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RegisterForm from './components/RegisterForm';

function AdminNav() {
  const location = useLocation();
  const { logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Library className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">Biblioteca</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/books"
                className={`${
                  location.pathname.startsWith('/books')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Book className="h-4 w-4 mr-2" />
                Libros
              </Link>
              <Link
                to="/users"
                className={`${
                  location.pathname === '/users'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Users className="h-4 w-4 mr-2" />
                Usuarios
              </Link>
              <Link
                to="/loans"
                className={`${
                  location.pathname === '/loans'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <Search className="h-4 w-4 mr-2" />
                Préstamos
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AdminRoutes() {
  return (
    <>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/category/:category" element={<BookList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/loans" element={
            <div className="space-y-8">
              <NewLoan />
              <LoanList />
            </div>
          } />
        </Routes>
      </main>
    </>
  );
}

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right"
      toastOptions={{
        duration: 5000, // Duración en milisegundos (5 segundos)
      }} 
      />
      <AdminRoutes />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;