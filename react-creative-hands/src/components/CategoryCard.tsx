import React from 'react';
import Link from 'next/link';
import { Category } from '@/data/Category';
import '../app/styles/CategoryCard.css';
import { FaGift, FaPen, FaBook, FaStickyNote, FaPaintBrush, FaPencilRuler, FaPuzzlePiece, FaBoxes } from 'react-icons/fa';
import { GiNotebook, GiSchoolBag, GiPaintBucket, GiPaintBrush, GiThink } from 'react-icons/gi';
import { MdOutlineColorLens, MdWork } from 'react-icons/md';
import { TbTools } from "react-icons/tb";

import { RxScissors } from "react-icons/rx";
const iconMap: Record<string, JSX.Element> = {
    'عام': <FaBoxes />,
    'ادوات مدرسيه': <GiSchoolBag />,
    'اقلام': <FaPen />,
    'مقصات': <RxScissors />,
    'دفاتر': <GiNotebook />,
    'دوسيات': <FaStickyNote />,
    'صمغ': <GiPaintBucket />,
    'ادوات فنيه': <FaPaintBrush />,
    'هدايا': <FaGift />,
    'رزم فنيه': <FaPencilRuler />,
    'اوراق': <FaBook />,
    'دفاتر تلوين': <GiPaintBrush />,
    'ادوات عمل': <MdWork />,
    'الوان': <MdOutlineColorLens />,
    'العاب': <FaPuzzlePiece />,
    'ادوات تفكيريه': <GiThink />,
    'مهارات تلوين': <FaPaintBrush />,
    'ادوات للمكتب': <TbTools />,
    'تلوين بواسطة الترصيع': <MdOutlineColorLens />,
    'تلوين حسب ارقام': <MdOutlineColorLens />,
    'صناديق': <FaBoxes />,
};


interface CategoryCardProps {
    id: Category['Id'];
    name: Category['Name'];
    index: number;

}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, index }) => {
    const icon = iconMap[name] || <FaBoxes />; 
    return (
        <Link href={`/products-list/${id}?name=${encodeURIComponent(name)}`}>
            <div className={`category-card color-${index % 6}`}>
                <div className="icon">{icon}</div>
                <div className="name">{name}</div>
            </div>
        </Link>
    );
};

export default CategoryCard;
