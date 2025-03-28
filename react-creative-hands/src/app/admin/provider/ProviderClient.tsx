'use client';

import '@/app/styles/ProviderPage.css'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProviderById, saveProvider } from '@/services/providerService';
import { SiteProvider } from '@/data/SiteProvider';

// (Paste your full component code here without change)
const ProviderClient = () => {
    const { user, isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loadingProvider, setLoadingProvider] = useState(true);

    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [tel1, setTel1] = useState('');
    const [tel2, setTel2] = useState('');
    const [idN, setIdN] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [webSite, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [isActive, setIsActive] = useState(false);

    if ((!isLoggedIn || !user?.isAdmin) && !loading) {
        router.push('/');
    }

    const idParam = searchParams.get('providerId');
    const providerId = idParam ? Number(idParam) : 0;

    const modeParam = searchParams.get('mode');
    const mode: 'add' | 'edit' | 'view' =
        providerId === 0 ? 'add' : modeParam === 'view' ? 'view' : 'edit';

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    useEffect(() => {
        const laodProvider = async () => {
            try {

                setLoadingProvider(true);
                if (providerId > 0 && (isEditMode || isViewMode)) {
                    const prov = await getProviderById(providerId);
                    console.log("Start loading provider..", prov);
                    if (prov != null) {
                        setId(providerId);
                        setName(prov.name);
                        setTel1(prov.tel1);
                        setTel2(prov.tel2);
                        setIdN(prov.idN);
                        setAddress(prov.address);
                        setDescription(prov.description);
                        setWebsite(prov.webSite);
                        setEmail(prov.email);
                        setIsActive(prov.isActive);
                    }
                }
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setLoadingProvider(false);
            }
        }
        laodProvider();
    }, [isViewMode, isEditMode, providerId]);

    type ValidationResult = string | null;

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        const validationError = validateProviderForm(idN, webSite);
        if (validationError) {
            alert(validationError);
            return;
        }

        const _provider: SiteProvider = {
            id: providerId,
            name: name,
            idN: idN,
            tel1: tel1,
            tel2: tel2,
            address: address,
            description: description, // or Description
            webSite: webSite,
            email: email, // or Email
            isActive: isActive,
        };

        try {
            console.log("🔄 Saving provider...", _provider);


            const provId = await saveProvider(_provider);


            if (provId && provId > 0) {
                console.log("Provider saved:", provId);

                const successMessage = isEditMode ? '✅ تم تحديث المزود بنجاح!' : '✅ تم حفظ المزود بنجاح!';
                alert(successMessage);

                router.push('/admin/provider?providerId=' + provId + '&mode=view');
            } else {
                console.error("Provider save returned invalid ID:", provId);
                alert('❌ فشل أثناء حفظ المزود');
            }
        } catch (error) {
            console.error("eror saving provider:", error)
            alert('❌ حدث خطأ أثناء حفظ المزود');
        }
    }

    function validateProviderForm(idN: string, webSite: string): ValidationResult {
        // تحقق من رقم الهوية
        const isValidIdN = /^\d{9}$/.test(idN);
        if (!isValidIdN) {
            return "❌ رقم الهوية يجب أن يحتوي على 9 أرقام";
        }

        // تحقق من رابط الموقع الإلكتروني
        try {
            new URL(webSite);
        } catch (_) {
            return "❌ الرجاء إدخال رابط موقع إلكتروني صحيح. مثال: https://www.example.com";

        }

        return null; // ✅ جميع القيم صحيحة
    }

    if (loadingProvider) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل المزود...</p>
            </div>
        );
    }


    return (
        <div className="provider-container">
            <h1>
                {isViewMode ? 'عرض المزود' : isEditMode ? 'تعديل المزود' : 'إضافة مزود جديد'}
            </h1>
            <form className="add-product-form" onSubmit={handleSubmit}>
                {/* Section 1: Basic Info */}
                <div className="section section-basic-info">
                    <h2>معلومات المزود</h2>

                    <label>المعرف:</label>
                    <input type="text" value={id} disabled />

                    <label>اسم المزود:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isViewMode} required />

                    <label>رقم الهويه:</label>
                    <input type="text" value={idN} onChange={(e) => setIdN(e.target.value)} disabled={isViewMode} required />

                    <label>هاتف 1:</label>
                    <input type="tel" value={tel1} onChange={(e) => setTel1(e.target.value)} disabled={isViewMode} required />

                    <label>هاتف 2:</label>
                    <input type="tel" value={tel2} onChange={(e) => setTel2(e.target.value)} disabled={isViewMode} required />

                    <label>العنوان:</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isViewMode} required />

                    <label>بريد الكتروني:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isViewMode} required />

                    <label>الموقع الالكتروني:</label>
                    <input type="text" value={webSite} onChange={(e) => setWebsite(e.target.value)} disabled={isViewMode} required />

                    <label>الوصف:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={isViewMode} required />

                    <label>نشط:</label>
                    <input type="radio" checked={isActive === true} onChange={() => setIsActive(true)} disabled={isViewMode} required />نعم
                    <input type="radio" checked={isActive === false} onChange={() => setIsActive(false)} disabled={isViewMode} required />لا


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

export default ProviderClient;
