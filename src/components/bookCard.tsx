import { Eye } from "lucide-react";

export default function BookCard({
  book,
  background,
  onViewDetails,
}: {
  book: any;
  background: string;
  onViewDetails: () => void;
}) {
  return (
    <div className="group bg-white overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <div className={`absolute inset-0 ${background} opacity-10`}></div>
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
        <p className="mt-1 text-sm text-gray-500">{book.autor}</p>
        <span
          className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${background} text-white`}
        >
          {book.categoria}
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
            onClick={onViewDetails}
            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </button>
        </div>
      </div>
    </div>
  );
}