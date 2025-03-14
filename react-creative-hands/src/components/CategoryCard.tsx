import React from 'react';
import Link from 'next/link';
import { Category } from '@/data/Category';
import '../app/styles/CategoryCard.css';

interface CategoryCardProps {
    Id: Category['Id'];
    Name: Category['Name'];
}

const CategoryCard: React.FC<CategoryCardProps> = ({ Id, Name }) => {
    return (
        <Link href={`/categories/${Id}`}>
            <div className="category-card">
                {Name}
            </div>
        </Link>
    );
};

export default CategoryCard;
