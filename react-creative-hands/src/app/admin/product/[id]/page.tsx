'use client';

import { HexColorPicker } from "react-colorful";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { fetchCategories, fetchProduct, saveProduct, updateProduct, uploadProductImages} from '@/services/productService';
import { Category } from '@/data/Category';
import '@/app/styles/ProductPage.css';
import { ProductVariationModel } from "@/data/ProductVariationModel";
import { SaveProductRequest } from "@/data/SaveProductRequest";

const ProductPage = () => {
    const { user, isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const idParam = params?.id;
    const id = idParam ? Number(idParam) : 0;

    const modeParam = searchParams.get('mode');
    const mode: 'add' | 'edit' | 'view' =
        id === 0 ? 'add' : modeParam === 'view' ? 'view' : 'edit';

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    const [barcode, setBarcode] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentColor, setCurrentColor] = useState("#aabbcc");
    const [description, setDescription] = useState('');
    //const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [stockQuantity, setStockQuantity] = useState(0);
    const [variations, setVariations] = useState<ProductVariationModel[]>([]);
    const [loadingProduct, setLoadingProduct] = useState<boolean>(true);

    useEffect(() => {
        if ((!isLoggedIn || !user?.isAdmin) && !loading) {
            router.push('/');
        }

        const loadCategories = async () => {
            const categoriesData = await fetchCategories();
            setCategories(categoriesData);
        };

        const loadProductForEditOrView = async () => {
            try {
                setLoadingProduct(true);
                if (id > 0 && (isEditMode || isViewMode)) {
                    const productData = await fetchProduct(id);
                    console.log("productData:", productData);

                    const colorCodes = (productData.availableColours ?? []).map(colorObj => colorObj.Code);
                    const imageFilenames = (productData.images ?? []).map(img => `${img.Id}.${img.Extension}`);
                    setExistingImages(imageFilenames);

                    setName(productData.name);
                    setBarcode(productData.barcode);
                    setPrice(productData.price);
                    setSalePrice(productData.salePrice);
                    setDescription(productData.description);
                    setStockQuantity(productData.stockQuantity);
                    setSelectedCategories(productData.categoriesIds);
                    setSelectedColors(colorCodes);
                    setVariations(productData.productVariations ?? []);
                }
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setLoadingProduct(false);
            }

        };

        loadCategories();
        loadProductForEditOrView();
    }, [loading, isLoggedIn, user, router, id, isEditMode, isViewMode]);

    const handleCategoryToggle = (id: number) => {
        if (isViewMode) return;

        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter((catId) => catId !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const handleAddColor = () => {
        if (isViewMode) return;

        if (!selectedColors.includes(currentColor)) {
            setSelectedColors([...selectedColors, currentColor]);
        }
    };

    const handleRemoveColor = (colorToRemove: string) => {
        if (isViewMode) return;

        setSelectedColors(selectedColors.filter(color => color !== colorToRemove));
    };

    const handleAddVariation = () => {
        if (isViewMode) return;

        const generateTempId = () => Math.floor(Math.random() * 1000000);
        const newVariation: ProductVariationModel = {
            Id: generateTempId(),
            ProductId: 0,
            Price: 0,
            Description: ''
        };

        setVariations(prev => [...prev, newVariation]);
    };

    const handleVariationChange = (index: number, field: keyof ProductVariationModel, value: any) => {
        if (isViewMode) return;

        const updatedVariations = [...variations];
        updatedVariations[index] = {
            ...updatedVariations[index],
            [field]: field === "Price" ? parseFloat(value) : value
        };
        setVariations(updatedVariations);
    };

    const handleDeleteVariation = (index: number) => {
        if (isViewMode) return;

        const updatedVariations = [...variations];
        updatedVariations.splice(index, 1);
        setVariations(updatedVariations);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewMode) return;
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setNewImages((prevImages) => [...prevImages, file]);
        e.target.value = '';
    };

    const handleRemoveImage = (index: number) => {
        if (isViewMode) return;

        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewMode) return;

        try {
            if (isAddMode) {
                const uploadResponse = await uploadProductImages(images, 0);
                if (!uploadResponse) return alert('❌ فشل رفع الصور');

                const fixedVariations = variations.map(variation => ({
                    ...variation,
                    ProductId: uploadResponse.ProductId
                }));

                const saveRequest: SaveProductRequest = {
                    id: uploadResponse.ProductId,
                    name,
                    barcode,
                    price,
                    salePrice,
                    description,
                    stockQuantity,
                    categories: selectedCategories,
                    availableColours: selectedColors,
                    productVariations: fixedVariations,
                    images: [],
                    uploadedImages: uploadResponse.UploadedImages
                };

                const savedProductId = await saveProduct(saveRequest);
                if (!savedProductId) return alert('❌ فشل حفظ المنتج');
                alert('✅ تم حفظ المنتج بنجاح!');
            }

            if (isEditMode) {
                const saveRequest: SaveProductRequest = {
                    id,
                    name,
                    barcode,
                    price,
                    salePrice,
                    description,
                    stockQuantity,
                    categories: selectedCategories,
                    availableColours: selectedColors,
                    productVariations: variations,
                    images: [],
                    uploadedImages: [] // You may handle differently
                };

                const updatedProductId = await updateProduct(saveRequest);
                if (!updatedProductId) return alert('❌ فشل تحديث المنتج');
                alert('✅ تم تحديث المنتج بنجاح!');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            alert('❌ حدث خطأ أثناء حفظ المنتج');
        }
    };

    if (loadingProduct) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل المنتج...</p>
            </div>
        );
    }

    return (
        <div className="add-product-page-container">
            <h1>
                {isViewMode ? 'عرض المنتج' : isEditMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h1>

            <form className="add-product-form" onSubmit={handleSubmit}>
                {/* Section 1: Basic Info */}
                <div className="section section-basic-info">
                    <h2>معلومات المنتج</h2>

                    <label>اسم المنتج:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isViewMode} required />

                    <div className="price-row">
                        <div className="price-input">
                            <label>السعر:</label>
                            <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} disabled={isViewMode} required />
                        </div>

                        <div className="sale-price-input">
                            <label>سعر العرض (اختياري):</label>
                            <input type="number" value={salePrice} onChange={(e) => setSalePrice(parseFloat(e.target.value))} disabled={isViewMode} />
                        </div>
                    </div>

                    <label>الوصف:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={isViewMode} />

                    <div className="barcode-quantity-row">
                        <div className="barcode-input">
                            <label>الباركود:</label>
                            <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} disabled={isViewMode} />
                        </div>

                        <div className="quantity-input">
                            <label>الكمية بالمخزون:</label>
                            <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(parseInt(e.target.value))} disabled={isViewMode} required />
                        </div>
                    </div>
                </div>

                {/* Section 2: Images */}
                <div className="section section-images">
                    <h2>صور المنتج</h2>

                    <div className="image-upload-wrapper">
                        <label className="image-upload-button">
                            ➕ إضافة صورة
                            <input type="file" accept="image/*" onChange={handleImageChange} disabled={isViewMode} style={{ display: 'none' }} />
                        </label>
                    </div>

                    <div className="image-preview-grid">
                        {existingImages.map((filename, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={`http://creativehandsco.com/assets/Images/${filename}`} alt={`صورة ${index + 1}`} className="image-preview" />
                                {!isViewMode && (
                                    <span className="delete-image-icon" onClick={() => handleRemoveImage(index)} title="حذف الصورة">❌</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Variations */}
                <div className="section section-variations">
                    <div className="section-title-with-info">
                        <h2>المتغيرات</h2>
                        <div className="info-icon-wrapper" tabIndex={0}>
                            <span className="info-icon">ℹ️</span>
                            <div className="info-tooltip">
                                <strong>ما هي المتغيرات؟</strong><br />
                                المتغيرات تتيح لك إضافة أسعار أو أوصاف مختلفة لنفس المنتج.<br /><br />
                                <strong>أمثلة:</strong><br />
                                <ul>
                                    <li><strong>الوصف:</strong> ربطه 70 ورقه - <strong>السعر:</strong> 12.00</li>
                                    <li><strong>الوصف:</strong> 4 اوراق - <strong>السعر:</strong> 1.00</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {!isViewMode && (
                        <button type="button" onClick={handleAddVariation} className="add-variation-button">➕ إضافة متغير</button>
                    )}

                    <div className="variations-list">
                        {variations.map((variation, index) => (
                            <div key={variation.Id} className="variation-item">
                                <label>السعر:</label>
                                <input className="variation-item-price" type="number" value={variation.Price} onChange={(e) => handleVariationChange(index, "Price", e.target.value)} disabled={isViewMode} />

                                <label>الوصف:</label>
                                <input className="variation-item-description" type="text" value={variation.Description} onChange={(e) => handleVariationChange(index, "Description", e.target.value)} disabled={isViewMode} />

                                {!isViewMode && (
                                    <button type="button" className="delete-variation-button" onClick={() => handleDeleteVariation(index)}>🗑️</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4: Colors */}
                <div className="section section-colors">
                    <h2>الألوان</h2>
                    <div className="color-picker-grid">
                        <div className="left-column">
                            {!isViewMode && (
                                <button type="button" onClick={handleAddColor}>➕ إضافة اللون</button>
                            )}

                            <div className="selected-colors">
                                {selectedColors.map((color, index) => (
                                    <div key={index} className="selected-color-container">
                                        <div className="color-box" style={{ backgroundColor: color }}>
                                            {!isViewMode && (
                                                <span className="delete-icon" onClick={() => handleRemoveColor(color)} title="حذف اللون">❌</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="right-column">
                            <HexColorPicker color={currentColor} onChange={setCurrentColor} disabled={isViewMode} />
                        </div>
                    </div>
                </div>

                {/* Section 5: Categories */}
                <div className="section section-categories">
                    <h2>التصنيفات</h2>

                    <div className="categories-grid">
                        {categories.map((category) => (
                            <label key={category.Id} className="category-item">
                                <input type="checkbox" value={category.Id} checked={selectedCategories.includes(category.Id)} onChange={() => handleCategoryToggle(category.Id)} disabled={isViewMode} />
                                {category.Name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Section 6: Submit */}
                {!isViewMode && (
                    <div className="section section-submit">
                        <button type="submit">{isEditMode ? 'تحديث المنتج' : 'حفظ المنتج'}</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProductPage;
