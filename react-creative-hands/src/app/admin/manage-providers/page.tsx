'use client';

import '@/app/styles/ManageProvidersPage.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProviders, deleteProvider } from '@/services/providerService';
import { SiteProvider } from '@/data/SiteProvider';

const ManageProviders = () => {
    const router = useRouter();
    const [providers, setProviders] = useState<SiteProvider[]>([]);
    //const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [activeFilter, setActiveFilter] = useState<number>(-1);
    const [selectedProvider, setSelectedProvider] = useState<SiteProvider | null>(null);

    useEffect(() => {
        const loadProviders = async () => {
            try {
                setLoadingProviders(true);

                const provs = await getProviders();
                setProviders(provs);
                //setFilteredProviders(provs);

            } catch (error) {
                console.error("Error loading provider:", error);
            } finally {
                setLoadingProviders(false);
            }

        }

        loadProviders();
    }, [])

    if (loadingProviders) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل المزودين...</p>
            </div>
        );
    }  

    function handleEditProvider(id: any): void {
        router.push(`/admin/provider/${id}`);
    }

    
    function handleDeleteProvider(id: number): void {
        const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا المزود؟");

        if (!confirmed) return;

        deleteProvider(id)
            .then(success => {
                if (success) {
                    alert("✅ تم حذف المزود بنجاح");
                    setProviders(prev => prev.filter(p => p.id !== id));
                } else {
                    alert("❌ فشل في حذف المزود");
                }
            })
            .catch(error => {
                console.error("Delete error:", error);
                alert("❌ حدث خطأ أثناء الحذف");
            });
    }


    function handleAddProvider(): void {
        router.push(`/admin/provider/0`);
    }

    const filteredProviders = providers.filter(p => {
        if (activeFilter === -1) return true;
        return p.isActive === (activeFilter === 1);
    });
    function handleViewProviderDetails(provider: SiteProvider) {
        setSelectedProvider(provider);
    }
    function closeModal() {
        setSelectedProvider(null);
    }


    return (
        <div>
            <h1>إدارة المزودين</h1>
            <div className="filters-container">
                <div className="search-input-wrapper">
                    <select value={activeFilter} onChange={(e) => setActiveFilter(Number(e.target.value))}>
                        <option value={-1}>جميع المزودين</option>
                        <option value={1}>المزودين النشطين</option>
                        <option value={0}>المزودين الغير نشطين</option>
                    </select>

                    <button onClick={handleAddProvider} className="add-provider-button">
                        ➕ إضافة منتج
                    </button>
                </div>
                <table className="providers-table">
                    <thead>
                        <tr>
                            <th>المعرف</th>
                            <th>اسم المزود</th>                            
                            <th>هاتف 1</th>
                            <th>البريد الالكتروني</th>
                            <th>الوصف</th>
                            <th>نشط</th>
                            <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProviders.length === 0 ? (
                            <tr>
                                <td colSpan={7}>لا توجد منتجات</td>
                            </tr>
                        ) : (
                            filteredProviders.map(prov => (
                                <tr key={prov.id}>
                                    <td>{prov.id}</td>
                                    <td>{prov.name}</td>                                    
                                    <td>{prov.tel1}</td>                                                                        
                                    <td>{prov.email}</td>                                    
                                    <td className="description-cell" title={prov.description}>
                                        {prov.description.length > 50
                                            ? prov.description.substring(0, 50) + '...'
                                            : prov.description}
                                    </td>
                                    <td>{prov.isActive ? "نشط" :"غير نشط"}</td> 
                                    <td>
                                        <button
                                            onClick={() => handleEditProvider(prov.id)}
                                            className="edit-button"
                                        >
                                            ✏️ تعديل
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProvider(prov.id)}
                                            className="delete-button"
                                        >
                                            🗑️ حذف
                                        </button>
                                        <button
                                            onClick={() => handleViewProviderDetails(prov)}
                                            className="view-button"
                                        >
                                            👁️ عرض 
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedProvider && (
                <div className="popup-overlay" onClick={closeModal}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>تفاصيل المزود</h2>
                        <div className="popup-grid">
                            <div><strong>الاسم:</strong> {selectedProvider.name}</div>
                            <div><strong>المعرف:</strong> {selectedProvider.id}</div>
                            <div><strong>رقم الهوية:</strong> {selectedProvider.idN}</div>
                            <div><strong>الهاتف 1:</strong> {selectedProvider.tel1}</div>
                            <div><strong>الهاتف 2:</strong> {selectedProvider.tel2}</div>
                            <div><strong>العنوان:</strong> {selectedProvider.address}</div>
                            <div><strong>البريد:</strong> {selectedProvider.email}</div>
                            <div><strong>الموقع:</strong> {selectedProvider.webSite}</div>
                            <div><strong>الوصف:</strong> {selectedProvider.description}</div>
                            <div><strong>نشط:</strong> {selectedProvider.isActive ? 'نعم' : 'لا'}</div>
                        </div>
                        <button onClick={closeModal} className="popup-close-button">
                            إغلاق
                        </button>
                    </div>
                </div>
            )}


        </div>
            );
}

            export default ManageProviders;