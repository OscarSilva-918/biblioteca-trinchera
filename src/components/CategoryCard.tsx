import { BookOpen } from "lucide-react";

export default function CategoryCard({
  category,
  categoryBooks,
  availableBooks,
  background,
  onClick,
}: {
  category: string;
  categoryBooks: any[];
  availableBooks: any[];
  background: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className={`absolute inset-0 ${background} opacity-90`}></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <BookOpen className="h-8 w-8 text-white" />
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
            {categoryBooks.length} libros
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{category}</h3>
        <p className="mt-2 text-sm text-white text-opacity-90">
          {categoryBooks.length === 0
            ? "No hay libros en esta categoría"
            : `${availableBooks.length} disponibles`}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </div>
  );
}