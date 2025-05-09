import { useState, useEffect } from "react";
import { Plus, Eye, BookOpen } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {  bookCategories } from "../lib/db";
import { Book } from "../types";
import toast from "react-hot-toast";
import BookModal from "./BookModal";
import { supabase } from "../lib/supabase";


const categoryBackgrounds = {
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
  const [data, setData] = useState("");
  const [books, setBooks] = useState<(Book & { isAvailable: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<
    (Book & { isAvailable: boolean }) | null
  >(null);
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      let { data: libros, error } = await supabase
        .from("libros")
        .select("*");

      // const data = await booksApi.list();
      setBooks(libros);
      console.log("Libros:", libros[0]);
    } catch (error) {
      toast.error("Error al cargar los libros");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If we're on the main books page, show categories
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
          {bookCategories.map((cat) => {
            const categoryBooks = books.filter((book) => book.categoria === cat);
            const availableBooks = categoryBooks.filter((b) => b.isAvailable);

            return (
              <div
                key={cat}
                onClick={() =>
                  navigate(`/books/category/${encodeURIComponent(cat)}`)
                }
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 ${categoryBackgrounds[cat]} opacity-90`}
                ></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-8 w-8 text-white" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {categoryBooks.length} libros
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {cat}
                  </h3>
                  <p className="mt-2 text-sm text-white text-opacity-90">
                    {categoryBooks.length === 0
                      ? "No hay libros en esta categoría"
                      : `${availableBooks.length} disponibles`}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Show books for selected category
  const filteredBooks = books.filter((book) => book.categoria === category);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/books"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900 transition-colors duration-300"
          >
            ← Volver a categorías
          </Link>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{category}</h2>
        </div>
        <Link
          to="/books/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar nuevo libro
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="group bg-white overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative">
              <div
                className={`absolute inset-0 ${
                  categoryBackgrounds[book.categoria]
                } opacity-10`}
              ></div>
              <img
                src={book.imagen_url[0]}
                alt={book.titulo}
                className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                {book.titulo}
              </h4>
              <p className="mt-1 text-sm text-gray-500">{book.author}</p>
              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  categoryBackgrounds[book.category]
                } text-white`}
              >
                {book.category}
              </span>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    book.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.isAvailable ? "Disponible" : "Prestado"}
                </span>
                <button
                  onClick={() => setSelectedBook(book)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver detalles
                </button>
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
