'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

interface Variant {
  _key?: string;
  title: string;
  price?: number;
  stock: number;
  itemNumber?: string;
  variantImagesUrls?: string[];
}

interface ProductDetailContentProps {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    stock: number;
    itemNumber: string;
    description?: string;
    conditionNotes?: string;
    imageUrl?: string;
    slug: { current: string };
    variants?: Variant[];
  };
  onImageChange?: (url?: string) => void;
}

export default function ProductDetailContent({ product, onImageChange }: ProductDetailContentProps) {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(
    product.variants && product.variants.length > 0 ? 0 : -1
  );

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const [showAllVariants, setShowAllVariants] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  
  const INITIAL_VISIBLE_COUNT = 6;
  const CHARACTER_LIMIT = 100; // Límite de caracteres para colapsar la descripción

  const hasVariants = product.variants && product.variants.length > 0;
  
  const activeVariant = hasVariants && selectedVariantIndex !== -1 && selectedVariantIndex < product.variants!.length
    ? product.variants![selectedVariantIndex]
    : null;

  const currentPrice = (product.price === 0 && activeVariant?.price !== undefined) 
    ? activeVariant.price 
    : (activeVariant?.price !== undefined && activeVariant?.price !== null ? activeVariant.price : product.price);

  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const currentItemNumber = activeVariant?.itemNumber || product.itemNumber;

  const currentImages = activeVariant?.variantImagesUrls && activeVariant.variantImagesUrls.length > 0 
    ? activeVariant.variantImagesUrls 
    : product.imageUrl ? [product.imageUrl] : [];

  const selectedImageUrl = currentImages[activeImageIndex] || currentImages[0];

  const cartItemId = activeVariant && activeVariant._key 
    ? `${product._id}_${activeVariant._key}` 
    : activeVariant 
    ? `${product._id}_${activeVariant.title.replace(/\s+/g, '-')}` 
    : product._id;

  const isAlreadyInCart = items.some((item) => item._id === cartItemId);

  const hasDiscount = product.originalPrice && product.originalPrice > 0 && product.originalPrice > currentPrice;
  const savingsAmount = hasDiscount ? product.originalPrice! - currentPrice : 0;
  const savingsPercentage = hasDiscount ? Math.round((savingsAmount / product.originalPrice!) * 100) : 0;

  // Lógica para el truncado de la descripción
  const descriptionText = product.description || 'No detailed description available for this product.';
  const isLongDescription = descriptionText.length > CHARACTER_LIMIT;
  const truncatedDescription = isLongDescription && !isDescriptionExpanded
    ? `${descriptionText.substring(0, CHARACTER_LIMIT)}...`
    : descriptionText;

  // Sincronizar imagen inicial y al cambiar de variante (reseteando al índice 0)
  useEffect(() => {
    if (onImageChange) {
      const initialImage = activeVariant?.variantImagesUrls?.[0] || product.imageUrl;
      onImageChange(initialImage);
    }
  }, [selectedVariantIndex, product, activeVariant, onImageChange]);

  // Respaldo de índice al contraer la lista
  useEffect(() => {
    if (!showAllVariants && product.variants && product.variants.length > INITIAL_VISIBLE_COUNT) {
      if (selectedVariantIndex >= INITIAL_VISIBLE_COUNT) {
        setSelectedVariantIndex(0);
        setActiveImageIndex(0);
      }
    }
  }, [showAllVariants, selectedVariantIndex, product.variants]);

  const handleSelectVariant = (index: number) => {
    setSelectedVariantIndex(index);
    setActiveImageIndex(0);
  };

  const handleAddToCart = () => {
    if (isAlreadyInCart || currentStock === 0) return;

    const itemName = activeVariant ? `${product.name} (${activeVariant.title})` : product.name;

    addItem({
      _id: cartItemId,
      name: itemName,
      price: currentPrice,
      imageUrl: selectedImageUrl,
      slug: product.slug.current,
      itemNumber: currentItemNumber,
      stock: currentStock,
    });
  };

  const displayedVariants = showAllVariants 
    ? product.variants 
    : product.variants?.slice(0, INITIAL_VISIBLE_COUNT);

  const hiddenVariantsCount = (product.variants?.length || 0) - INITIAL_VISIBLE_COUNT;

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div>
        <h1 className="uppercase text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-baseline gap-3 mb-6">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            ${currentPrice?.toFixed(2)}
          </div>

          {hasDiscount && (
            <div className="text-lg font-mono font-bold text-slate-400 line-through">
              ${product.originalPrice?.toFixed(2)}
            </div>
          )}

          {hasDiscount && (
            <div className="bg-amber-400 text-slate-900 text-xs font-mono font-bold px-2.5 py-1 tracking-wide shadow-2xs">
              SAVE ${savingsAmount.toFixed(2)} ({savingsPercentage}%)
            </div>
          )}
        </div>

        {/* MINIATURAS DE IMÁGENES DE LA VARIANTE CORREGIDAS */}
        {currentImages.length > 1 && (
          <div className="mb-6 space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {currentImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    if (onImageChange) {
                      onImageChange(imgUrl);
                    }
                  }}
                  className={`w-14 h-14 rounded border-2 overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-slate-900 scale-105' : 'border-slate-200 opacity-70 '
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {hasVariants && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <label className=" block text-xs font-bold text-slate-500 uppercase tracking-wider">
                available titles ({product.variants!.length}):
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {displayedVariants!.map((variant) => {
                const index = product.variants!.findIndex(v => v === variant);
                const isSelected = selectedVariantIndex === index;
                const isOutOfStock = variant.stock === 0;

                return (
                  <button
                    key={variant._key || index}
                    type="button"
                    onClick={() => handleSelectVariant(index)}
                    className={`uppercase px-3 py-2.5 text-xs font-bold text-left transition-all border rounded-md flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : isOutOfStock
                        ? 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                        : 'border-slate-200 bg-white text-slate-700 '
                    }`}
                  >
                    <span className="truncate w-full">{variant.title}</span>
                    <span className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {isOutOfStock ? 'Out of Stock' : `${variant.stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>

            {product.variants!.length > INITIAL_VISIBLE_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllVariants(!showAllVariants)}
                className="w-full mt-2 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 rounded-md transition-all"
              >
                {showAllVariants 
                  ? 'Show Less ▲' 
                  : `+ Show ${hiddenVariantsCount} More Titles ▼`}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-mono font-bold text-teal-600 uppercase tracking-widest bg-teal-50 border border-teal-100 px-3 py-1">
            SKU: {currentItemNumber || 'N/A'}
          </span>

          <span
            className={`text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider ${
              currentStock > 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {currentStock > 0 ? `${currentStock} in Stock` : 'Out of Stock'}
          </span>
        </div>

        <div className="border-t border-slate-100 pt-4 mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Product Description
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-light">
            {truncatedDescription}
          </p>
          
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 text-xs font-bold text-black  uppercase tracking-wide flex items-center gap-1 transition-colors"
            >
              {isDescriptionExpanded ? 'Read Less ▲' : 'Read More ▼'}
            </button>
          )}
        </div>

        {product.conditionNotes && (
          <div className="bg-amber-50/70 border border-amber-200/80 p-4 mb-4">
            <h3 className="uppercase text-[10px] font-extrabold text-amber-900 tracking-wider mb-1 flex items-center gap-1.5">
              <span>⚠️</span> Condition & Package Notes
            </h3>
            <p className="uppercase text-amber-800 text-xs leading-relaxed whitespace-pre-line">
              {product.conditionNotes}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={currentStock === 0 || isAlreadyInCart}
        className={`w-full py-4 font-bold text-sm tracking-wide transition-all shadow-sm uppercase ${
          currentStock === 0
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            : isAlreadyInCart
            ? 'bg-emerald-600 text-white cursor-default'
            : 'bg-slate-900 text-white active:scale-[0.99] '
        }`}
      >
        {currentStock === 0
          ? 'Temporarily Out of Stock'
          : isAlreadyInCart
          ? 'Added to Cart'
          : hasVariants && selectedVariantIndex === -1
          ? 'Select an Option'
          : 'Add to Cart'}
      </button>
    </div>
  );
}