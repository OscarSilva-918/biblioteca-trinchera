export interface Book {
  id_libro: number;
  titulo: string;
  autor: string;
  categoria: string;
  descripcion: string;
  imagen_url: string[];
  isAvailable: boolean;
  isavailable: boolean; // <-- minúscula para coincidir con la base de datos
}

export interface Category {
  name: string;
  background: string;
}

export interface User {
  id: string;
  nombre: string; // <-- usa 'nombre' para coincidir con 'Perfil'
  email: string;
  role: 'admin' | 'usuario'; // <-- usa 'usuario' para coincidir con la base
  created_at: string;
}

export interface Loan {
  id: string;
  book_id: string;
  user_id: string;
  loan_date: string;
  return_date?: string;
  is_returned: boolean;
  created_at: string;
  book?: Book;
  user?: User;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'usuario';
}

// Para joins automáticos en Supabase
export interface Perfil {
  nombre: string;
}

export interface Libro {
  titulo: string;
}

export interface LoanRow {
  id_prestamo: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
  perfiles: Perfil | null;
  libros: Libro | null;
}