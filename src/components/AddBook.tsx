import React, { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // Importar el cliente de Supabase
import toast from "react-hot-toast";
import { bookCategories } from "../lib/db";

export default function AddBook() {
  const navigate = useNavigate();
  const [newBook, setNewBook] = useState({
    titulo: "",
    autor: "",
    categoria: "",
    descripcion: "",
    imagenUrls: [""],
  });
  const [imageUrlInputs, setImageUrlInputs] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false); // Estado para mostrar el indicador de carga

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); // Mostrar el indicador de carga

    try {
      const filteredImageUrls = imageUrlInputs.filter(
        (url) => url.trim() !== ""
      );

      // Enviar los datos a Supabase
      const { error } = await supabase.from("libros").insert([
        {
          titulo: newBook.titulo,
          autor: newBook.autor,
          categoria: newBook.categoria,
          descripcion: newBook.descripcion,
          imagen_url: filteredImageUrls, // Asegúrate de que el nombre del campo coincida con tu tabla
        },
      ]);

      if (error) {
        throw error; // Lanzar el error para manejarlo en el catch
      }

      toast.success("Libro agregado exitosamente");
      navigate("/books"); // Redirigir a la lista de libros
    } catch (error: any) {
      console.error(error);
      toast.error("Error al agregar el libro");
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  }

  const addImageUrlInput = () => {
    setImageUrlInputs([...imageUrlInputs, ""]);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrlInputs];
    newUrls[index] = value;
    setImageUrlInputs(newUrls);
    setNewBook({ ...newBook, imagenUrls: newUrls });
  };

  const removeImageUrl = (index: number) => {
    if (imageUrlInputs.length > 1) {
      const newUrls = imageUrlInputs.filter((_, i) => i !== index);
      setImageUrlInputs(newUrls);
      setNewBook({ ...newBook, imagenUrls: newUrls });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/books"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a libros
          </Link>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Agregar nuevo libro
          </h2>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título
                </label>
                <input
                  type="text"
                  id="titulo"
                  value={newBook.titulo}
                  onChange={(e) =>
                    setNewBook({ ...newBook, titulo: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="autor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Autor
                </label>
                <input
                  type="text"
                  id="autor"
                  value={newBook.autor}
                  onChange={(e) =>
                    setNewBook({ ...newBook, autor: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={newBook.categoria}
                  onChange={(e) =>
                    setNewBook({ ...newBook, categoria: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {bookCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  value={newBook.descripcion}
                  onChange={(e) =>
                    setNewBook({ ...newBook, descripcion: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>

              <div className="col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Imágenes
                </label>
                {imageUrlInputs.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`URL de la imagen ${index + 1}`}
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {imageUrlInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrlInput}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Agregar otra imagen
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading} // Deshabilitar el botón mientras se carga
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  "Cargando..."
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar libro
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
