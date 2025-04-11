export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  imageUrls: string[];
  category: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
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
  role: 'admin' | 'user';
}