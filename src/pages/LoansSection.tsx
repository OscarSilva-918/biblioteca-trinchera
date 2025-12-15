import { useState, useCallback, useEffect } from "react";
import NewLoan from "../components/NewLoan";
import LoanList from "../components/LoanList";
import { supabase } from "../lib/supabase";
// ...otros imports...

type SimpleBook = {
  id_libro: number;
  titulo: string;
  isavailable: boolean;
  isAvailable: boolean;
};

type SimpleLoan = {
  id_prestamo: number;
  fecha_prestamo: string;
  fecha_devolucion: string | null;
  perfiles: { nombre: string } | null;
  libros: { titulo: string } | null;
};

function LoansSection() {
  const [loans, setLoans] = useState<SimpleLoan[]>([]);
  const [loading, setLoading] = useState(true);

  const [books, setBooks] = useState<SimpleBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);

  const fetchLoans = useCallback(async () => {
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

    if (!error) {
      setLoans(
        (data || []).map((loan: any) => ({
          ...loan,
          perfiles: Array.isArray(loan.perfiles) ? loan.perfiles[0] || null : loan.perfiles,
          libros: Array.isArray(loan.libros) ? loan.libros[0] || null : loan.libros,
        }))
      );
    }
    setLoading(false);
  }, []);

  const fetchBooks = useCallback(async () => {
    setBooksLoading(true);
    const { data, error } = await supabase
      .from('libros')
      .select('id_libro, titulo, isavailable');
    if (!error) {
      setBooks(
        (data || []).map(book => ({
          ...book,
          isAvailable: book.isavailable // <-- mapea aquí
        }))
      );
    }
    setBooksLoading(false);
  }, []);

  useEffect(() => { fetchLoans(); }, [fetchLoans]);
  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  return (
    <div className="space-y-8">
      <NewLoan
        onLoanAdded={() => {
          fetchLoans();
          fetchBooks();
        }}
        books={books}
        booksLoading={booksLoading}
        fetchBooks={fetchBooks}
      />
      <LoanList
        loans={loans}
        loading={loading}
        fetchLoans={fetchLoans}
        fetchBooks={fetchBooks} 
      />
    </div>
  );
}
export default LoansSection;