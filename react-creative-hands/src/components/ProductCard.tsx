'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/data/Product';
import { getProductImageUrl, getDefaultProductImageUrl } from '@/utils/Helpers';
import '../app/styles/ProductCard.css';
import { useCart } from '@/context/CartContext';
import { CartItem } from '../data/CartItem';
import { ProductVariationModel } from '../data/ProductVariationModel';
import VariationModal from './VariationModal';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    //console.log("produc Rami Issa:", product);
    const { addToCart } = useCart();

    const [imgSrc, setImgSrc] = useState(getProductImageUrl(product.id));
    const [quantity, setQuantity] = useState(1);
    const [showColorError, setShowColorError] = useState(false);

    const [selectedColor, setSelectedColor] = useState<string>('');    
    const [selectedVariation, setSelectedVariation] = useState<ProductVariationModel | null>(null);
    const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
    const openVariationModal = () => {
        setIsVariationModalOpen(true);
    };

    const handleImageError = () => {
        setImgSrc(getDefaultProductImageUrl());
    };

    const handleAddToCart = () => {
        const hasVariations = product.productVariations && product.productVariations.length > 0;
        if (hasVariations && !selectedVariation) {
            setIsVariationModalOpen(true); // Open the modal for selection
            return;
        }
        console.log('Adding to cart:', {
            productId: product.id,
            variationId: selectedVariation?.Id || null,
            price: selectedVariation?.Price || product.price,
        });

        const hasColors = product.availableColours && product.availableColours.length > 0;
        if (hasColors && !selectedColor) {
            setShowColorError(true);
            return; // Stop here; don't proceed
        }
        setShowColorError(false);

        // Empty for now, we'll implement later!
        console.log(`Add product ${product.id} with quantity ${quantity} to cart`);
        console.log(`Selected color: ${selectedColor}`);
        const cartItem: CartItem = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            price: product.price,
            salePrice: product.salePrice ?? 0,            
            color: selectedColor || '',
            selectedVariationId: selectedVariation?.Id,
            selectedVariation: selectedVariation || null,
            note: '', // Optional: add later if you have notes field
        };

        addToCart(cartItem);
        alert('تم إضافة المنتج إلى السلة!');

    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };
    const handleColorSelect = (colorCode: string) => {
        setSelectedColor(colorCode);
    };

    const displayPrice = product.salePrice && product.salePrice > 0
        ? product.salePrice
        : product.price;

    return (
        <div className="product-card">
            {/* === Product Image === */}
            <div className="product-image">
                <Image
                    src={imgSrc}
                    alt={product.name}
                    width={192}
                    height={200}
                    onError={handleImageError}
                    className="product-image"
                />
            </div>
            <div className="product-info">
                {/* === Line 1: Name and Price === */}
                <div className="product-info-line">
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">{displayPrice} ₪</span>
                </div>
                <div className="product-info-line">
                    <span className="product-id-lable">رقم المنتج:</span>
                    <span className="product-id">{product.id.toString().padStart(4, '0')}</span>
                </div>
                {/* === Line 2: Available Colours (if exists) === */}
                {product.availableColours && product.availableColours.length > 0 && (
                    <div className="product-colours">
                        <span className="colours-label">الألوان:</span>
                        <div className="colour-options">
                            {product.availableColours.map((colour) => (
                                <div
                                    key={colour.Id}
                                    className={`colour-box ${selectedColor === colour.Code ? 'selected' : ''}`}
                                    style={{ backgroundColor: colour.Code }}
                                    title={colour.name}
                                    onClick={() => handleColorSelect(colour.Code)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {product.productVariations && product.productVariations.length > 0 && (
                    <div
                        className="variation-link"
                        style={{ cursor: 'pointer', color: '#007bff', marginTop: '5px' }}
                        onClick={openVariationModal}
                    >
                        {selectedVariation
                            ? `السعر المختار: ${selectedVariation.Price} ₪`
                            : 'اختر إمكانية سعر المنتج'}
                    </div>
                )}
                {/* === Add to Cart Section === */}
                <div className="add-to-cart">
                    <div className="quantity-controls">
                        <button className="quantity-btn" onClick={increaseQuantity}> ➕ </button>
                        <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="quantity-input"
                        />
                        <button className="quantity-btn" onClick={decreaseQuantity}> ➖ </button>
                    </div>

                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        🛒 {/* Or use an image/icon if you prefer */}
                    </button>
                </div>
                {showColorError && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <p>الرجاء اختيار اللون قبل إضافة المنتج إلى السلة</p>
                            <button onClick={() => setShowColorError(false)}>حسناً</button>
                        </div>
                    </div>
                )}
                {/* === Variation Modal (Coming Next Step) === */}
                {isVariationModalOpen && (
                    <VariationModal
                        variations={product.productVariations}
                        onSelect={(variation) => {
                            setSelectedVariation(variation);
                            setIsVariationModalOpen(false);
                        }}
                        onClose={() => setIsVariationModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductCard;
