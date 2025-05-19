import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Book } from "../types";
import toast from "react-hot-toast";
import BookModal from "../components/BookModal";
import EditBookModal from "../components/EditBookModal";
import { supabase } from "../lib/supabase";
import CategoryCard from "../components/CategoryCard";
import BookCard from "../components/BookCard";

//Actualice el nombre


const categoryBackgrounds: Record<string, string> = {
  Teología: "bg-gradient-to-br from-blue-500 to-blue-700",
  "Vida Cristiana": "bg-gradient-to-br from-green-500 to-green-700",
  Apologética: "bg-gradient-to-br from-purple-500 to-purple-700",
  "Estudios Bíblicos": "bg-gradient-to-br from-yellow-500 to-yellow-700",
  Devocional: "bg-gradient-to-br from-pink-500 to-pink-700",
  "Historia de la Iglesia": "bg-gradient-to-br from-red-500 to-red-700",
  Ministerio: "bg-gradient-to-br from-indigo-500 to-indigo-700",
  Evangelismo: "bg-gradient-to-br from-orange-500 to-orange-700",
  Biblia: "bg-gradient-to-br from-blue-500 to-blue-700",
};

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const { data: libros, error } = await supabase.from("libros").select("*");
      if (error) {
        throw new Error(error.message);
      }
      setBooks(libros || []);
    } catch (error) {
      toast.error("Error al cargar los libros");
    } finally {
      setLoading(false);
    }
  }

  async function editBook(bookId: number, updatedData: Partial<Book>) {
    try {
      const { error } = await supabase
        .from("libros")
        .update(updatedData)
        .eq("id_libro", bookId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Libro editado exitosamente");
      fetchBooks(); // Actualizar la lista de libros
    } catch (error) {
      toast.error("Error al editar el libro");
    }
  }

  async function deleteBook(bookId: number) {
    try {
      const { error } = await supabase
        .from("libros")
        .delete()
        .eq("id_libro", bookId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Libro borrado exitosamente");
      fetchBooks(); // Actualizar la lista de libros
    } catch (error) {
      toast.error("Error al borrar el libro");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
          <Link
            to="/books/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar nuevo libro
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(categoryBackgrounds).map((cat) => {
            const categoryBooks = books.filter((book) => book.categoria === cat);
            const availableBooks = categoryBooks.filter((b) => b.isAvailable);

            return (
              <CategoryCard
                key={cat}
                category={cat}
                categoryBooks={categoryBooks}
                availableBooks={availableBooks}
                background={categoryBackgrounds[cat]}
                onClick={() => navigate(`/books/category/${encodeURIComponent(cat)}`)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  const filteredBooks = books.filter((book) => book.categoria === category);

  return (
    <div className="space-y-6 mt-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 mb-4">No hay libros en esta categoría.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Volver atrás
            </button>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id_libro}
              book={book}
              background={categoryBackgrounds[book.categoria]}
              onViewDetails={() => setSelectedBook(book)}
            />
          ))
        )}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onEdit={() => {
            setEditingBook(selectedBook); // Abrir el modal de edición
            setSelectedBook(null); // Cerrar el modal de visualización
          }}
          onDelete={() => {
            deleteBook(selectedBook.id_libro); // Eliminar el libro
            setSelectedBook(null); // Cerrar el modal después de eliminar
          }}
        />
      )}

      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={(updatedData) => {
            editBook(editingBook.id_libro, updatedData);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
}
