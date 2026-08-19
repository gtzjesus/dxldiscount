'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  imageUrl?: string;
  extraImagesUrls?: string[];
  productName: string;
}

export default function ProductGallery({
  imageUrl,
  extraImagesUrls,
  productName,
}: ProductGalleryProps) {
  // Juntamos la imagen principal y las extraImages en una sola lista
  const allImages = [imageUrl, ...(extraImagesUrls || [])].filter(
    Boolean
  ) as string[];

  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || '');

  // 👈 EFECTO PARA QUE CAMBIE LA IMAGEN CUANDO SE SELECCIONA UNA VARIANTE
  useEffect(() => {
    setSelectedImage(imageUrl || allImages[0] || '');
  }, [imageUrl]);

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-white border-slate-100 overflow-hidden flex items-center justify-center p-6 shadow-sm">
        <span className="text-slate-400 text-xs font-medium">Sin imagen disponible</span>
      </div>
    );
  }

  return (
    <div className=" flex flex-col space-y-4">
      {/* Imagen Principal Grande */}
      <div className="relative aspect-square w-full bg-white border-slate-100 overflow-hidden flex items-center justify-center p-6 shadow-sm">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          className="object-contain object-center transition-all duration-300"
        />
      </div>

      {/* Galería de Miniaturas interactiva abajo */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((imgUrl, idx) => {
            const isSelected = selectedImage === imgUrl;
            return (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative aspect-square overflow-hidden transition-all bg-white border ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/10 scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`${productName} preview ${idx}`}
                  fill
                  className=" object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}