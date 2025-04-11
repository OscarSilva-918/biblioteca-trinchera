import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface BookModalProps {
  book: Book & { isAvailable: boolean };
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Detalles del libro</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="flex gap-6">
            <div className="w-1/2">
              <div className="relative rounded-lg overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                  }}
                  pagination={{ clickable: true }}
                  className="h-64"
                >
                  {book.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt={`${book.title} - imagen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {book.imageUrls.length > 1 && (
                  <>
                    <button className="swiper-button-prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="w-1/2">
              <h4 className="text-xl font-semibold text-gray-900">{book.title}</h4>
              <p className="mt-2 text-gray-600">por {book.author}</p>
              
              <div className="mt-4">
                <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                  book.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.isAvailable ? 'Disponible' : 'Prestado'}
                </span>
              </div>

              <div className="mt-4">
                <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {book.category}
                </span>
              </div>

              {book.isbn && (
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-medium">ISBN:</span> {book.isbn}
                </p>
              )}

              {book.description && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-900">Descripción</h5>
                  <p className="mt-1 text-sm text-gray-600">{book.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}