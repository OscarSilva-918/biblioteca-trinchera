import { Book, User, Loan } from '../types';

// Initial data
let books: Book[] = [
  {
    id: '1',
    title: 'En Busca de Santidad',
    author: 'Jerry Bridges',
    isbn: '978-0891091738',
    description: 'Un clásico sobre el crecimiento espiritual y la búsqueda de una vida santa que agrade a Dios.',
    imageUrls: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
      'https://images.unsplash.com/photo-1504052434569-70ad5c0a3ca8?w=800'
    ],
    category: 'Vida Cristiana',
    created_at: '2025-04-07T13:54:34.000Z'
  },
  {
    id: '2',
    title: 'Desiring God',
    author: 'John Piper',
    isbn: '978-1590521199',
    description: 'Una exploración profunda sobre encontrar satisfacción en Dios y experimentar la verdadera alegría cristiana.',
    imageUrls: [
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800',
      'https://images.unsplash.com/photo-1606938704652-3e588c2c9fd4?w=800'
    ],
    category: 'Teología',
    created_at: '2025-04-07T13:54:34.000Z'
  },
  {
    id: '3',
    title: 'Conociendo a Dios',
    author: 'J.I. Packer',
    isbn: '978-0830816507',
    description: 'Una obra fundamental sobre los atributos de Dios y cómo conocerlo más profundamente.',
    imageUrls: [
      'https://images.unsplash.com/photo-1507409613952-518459ac866f?w=800',
      'https://images.unsplash.com/photo-1518674660708-0e2c0473e68e?w=800'
    ],
    category: 'Teología',
    created_at: '2025-04-07T13:54:34.000Z'
  }
];

// Available categories
export const bookCategories = [
  'Teología',
  'Vida Cristiana',
  'Apologética',
  'Estudios Bíblicos',
  'Devocional',
  'Historia de la Iglesia',
  'Ministerio',
  'Evangelismo'
];

let users: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'admin@example.com',
    role: 'admin',
    created_at: '2025-04-07T13:54:34.000Z'
  },
  {
    id: '2',
    name: 'María García',
    email: 'user@example.com',
    role: 'user',
    created_at: '2025-04-07T13:54:34.000Z'
  }
];

let loans: Loan[] = [
  {
    id: '1',
    book_id: '1',
    user_id: '1',
    loan_date: '2025-04-07T13:54:34.000Z',
    is_returned: false,
    created_at: '2025-04-07T13:54:34.000Z'
  }
];

// Helper function to generate UUID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to check if a book is available
const isBookAvailable = (bookId: string) => {
  return !loans.some(loan => loan.book_id === bookId && !loan.is_returned);
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    if (!user || password !== '123456') { // Simple password check for demo
      throw new Error('Credenciales inválidas');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  },
  register: async (email: string, password: string, name: string) => {
    if (users.some(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }
    const newUser = {
      id: generateId(),
      email,
      name,
      role: 'user' as const,
      created_at: new Date().toISOString()
    };
    users = [...users, newUser];
    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    };
  }
};

// Books API
export const booksApi = {
  list: async () => {
    return books.map(book => ({
      ...book,
      isAvailable: isBookAvailable(book.id)
    }));
  },
  getById: async (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return null;
    return {
      ...book,
      isAvailable: isBookAvailable(book.id)
    };
  },
  create: async (book: Omit<Book, 'id' | 'created_at'>) => {
    const newBook = {
      ...book,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    books = [...books, newBook];
    return newBook;
  }
};

// Users API
export const usersApi = {
  list: async () => {
    return users;
  },
  create: async (user: Omit<User, 'id' | 'created_at' | 'role'>) => {
    const newUser = {
      ...user,
      id: generateId(),
      role: 'user' as const,
      created_at: new Date().toISOString()
    };
    users = [...users, newUser];
    return newUser;
  }
};

// Loans API
export const loansApi = {
  list: async () => {
    return loans.map(loan => ({
      ...loan,
      book: books.find(book => book.id === loan.book_id),
      user: users.find(user => user.id === loan.user_id)
    }));
  },
  listByUser: async (userId: string) => {
    return loans
      .filter(loan => loan.user_id === userId)
      .map(loan => ({
        ...loan,
        book: books.find(book => book.id === loan.book_id),
        user: users.find(user => user.id === loan.user_id)
      }));
  },
  create: async (loan: Omit<Loan, 'id' | 'created_at' | 'is_returned'>) => {
    if (!isBookAvailable(loan.book_id)) {
      throw new Error('El libro no está disponible');
    }
    const newLoan = {
      ...loan,
      id: generateId(),
      is_returned: false,
      created_at: new Date().toISOString()
    };
    loans = [...loans, newLoan];
    return newLoan;
  },
  update: async (id: string, data: Partial<Loan>) => {
    loans = loans.map(loan => 
      loan.id === id ? { ...loan, ...data } : loan
    );
    return loans.find(loan => loan.id === id);
  }
};