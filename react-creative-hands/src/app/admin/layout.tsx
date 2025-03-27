import React from 'react';
import Link from 'next/link';
import '@/app/styles/admin.css'; // CSS file stays the same
import { MdOutlineShoppingCart, MdOutlineInventory2, MdAddCircleOutline } from 'react-icons/md';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2>لوحة التحكم</h2>
                <ul>
                    <li>
                        <Link href="/admin/manage-orders" className="sidebar-link">
                            <MdOutlineShoppingCart className="sidebar-icon" />
                            إدارة الطلبات
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/manage-products" className="sidebar-link">
                            <MdOutlineInventory2 className="sidebar-icon" />
                            إدارة المنتجات
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/product/0" className="sidebar-link">
                            <MdAddCircleOutline className="sidebar-icon" />
                            إضافة منتج
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/manage-providers" className="sidebar-link">
                            <MdOutlineInventory2 className="sidebar-icon" />
                            إدارة المزودين
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/provider/0" className="sidebar-link">
                            <MdAddCircleOutline className="sidebar-icon" />
                            إضافة مزود
                        </Link>
                    </li>
                </ul>

            </aside>

            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
