import React from 'react';
import { Product } from '@/data/Product';
import ProductCard from '@/components/ProductCard';
import './styles.css';

interface ProductsListProps {
    products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
    if (!products || products.length === 0) {
        return <p className="no-products-text">لا توجد منتجات</p>;
    }

    return (
        <div className="products-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductsList;
