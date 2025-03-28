'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/Product'; // Adjust path if needed
import { getProducts, fetchCategories, deleteProduct } from '@/services/productService';
import { Category } from '@/data/Category';
import '@/app/styles/ManageProductsPage.css';

export default function ProductsClient() {
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchWrapperRef = useRef<HTMLDivElement>(null);

    //Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchWrapperRef.current &&
                !searchWrapperRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedProducts = await getProducts({
                    Id: -1,            // bring all products
                    Name: '',
                    Description: '',
                    Barcode: '',
                    CategoryId: -1,
                    SubCategoryId: -1,
                });
                //console.log("fetchedProducts: ", fetchedProducts)
                // const colorCodes = (fetchedProducts.availableColours ?? []).map(colorObj => colorObj.Code);
                const fetchedCategories = await fetchCategories();

                setProducts(fetchedProducts);
                setFilteredProducts(fetchedProducts);
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Failed to load products/categories:', error);
            }
        };

        loadData();
    }, []);

    // Filter function
    const filterProducts = (query: string, categoryId: number | null) => {
        let result = [...products];

        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(lowerQuery) ||
                p.description?.toLowerCase().includes(lowerQuery) ||
                p.barcode?.toLowerCase().includes(lowerQuery) ||
                p.id.toString().includes(lowerQuery));
        }

        if (categoryId && categoryId !== -1) {
            result = result.filter(p => p.categoriesIds.includes(categoryId));
        }

        setFilteredProducts(result);
    };

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSuggestions(value.length > 0);
        filterProducts(value, selectedCategory);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = parseInt(e.target.value);
        setSelectedCategory(categoryId);
        filterProducts(searchQuery, categoryId);
    };

    const handleEditProduct = (id: number) => {
        router.push(`/admin/product?productId=${id}`);
    };

    const handleAddProduct = () => {
        router.push(`/admin/product?productId=0`); // or `/admin/product/new`
    };
    const handleDeleteProduct = async (productId: number) => {
        const confirmDelete = window.confirm('هل أنت متأكد أنك تريد حذف هذا المنتج؟');

        if (!confirmDelete) return;

        try {
            const deleted = await deleteProduct(productId);

            if (deleted) {
                alert('✅ تم حذف المنتج بنجاح');

                // تحديث قوائم المنتجات
                const updatedProducts = products.filter(p => p.id !== productId);
                setProducts(updatedProducts);
                setFilteredProducts(updatedProducts);
            } else {
                alert('❌ فشل حذف المنتج');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            alert('❌ حدث خطأ أثناء حذف المنتج');
        }
    };

    return (
        <div className="manage-products-container">
            <h1>إدارة المنتجات</h1>

            <div className="filters-container">
                <div className="search-input-wrapper" ref={searchWrapperRef}>
                    <input
                        type="text"
                        placeholder="ابحث عن منتج..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                    />

                    {/* Auto-complete suggestion list */}
                    {showSuggestions && (
                        <div className="autocomplete-suggestions">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    className="suggestion-item"
                                    onClick={() => {
                                        handleEditProduct(product.id);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {product.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <select
                    className="category-dropdown"
                    value={selectedCategory ?? -1}
                    onChange={handleCategoryChange}
                >
                    <option value={-1}>كل التصنيفات</option>
                    {categories.map(cat => (
                        <option key={cat.Id} value={cat.Id}>
                            {cat.Name}
                        </option>
                    ))}
                </select>

                <button onClick={handleAddProduct} className="add-product-button">
                    ➕ إضافة منتج
                </button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>الرقم</th>
                        <th>الاسم</th>
                        <th>الباركود</th>
                        <th>الوصف</th>
                        <th>الألوان</th>
                        <th>التصنيفات</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan={7}>لا توجد منتجات</td>
                        </tr>
                    ) : (
                        filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.barcode}</td>
                                <td className="description-cell" title={product.description}>
                                    {product.description.length > 50
                                        ? product.description.substring(0, 50) + '...'
                                        : product.description}
                                </td>
                                <td className="colors-cell">
                                    <div className="colors-wrapper">
                                        {product.availableColours.map((color, idx) => (
                                            <div
                                                key={idx}
                                                className="color-circle"
                                                style={{ backgroundColor: color.Code || color.Code }}
                                                title={color.Code || color.Code}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="categories-cell">
                                    {categories
                                        .filter(cat => product.categoriesIds.includes(cat.Id))
                                        .map(cat => cat.Name)
                                        .join(', ')}
                                </td>

                                <td>
                                    <button
                                        onClick={() => handleEditProduct(product.id)}
                                        className="edit-button"
                                    >
                                        ✏️ تعديل
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="delete-button"
                                    >
                                        🗑️ حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

        </div>
    );
}
