export default function AboutPage() {
    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', direction:'rtl' }}>
            <h1>عن موقعنا</h1>

            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                هذا الموقع تم تطويره لتوفير تجربة تسوق سهلة وسريعة لمنتجات القرطاسية والأدوات الفنية والهدايا.
                نسعى دائمًا لتقديم الأفضل لعملائنا من خلال واجهة سهلة الاستخدام وميزات متقدمة لإدارة الطلبات والمنتجات.
            </p>

            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                تم بناء هذا المشروع باستخدام أحدث تقنيات الويب مثل <strong>React</strong> و<strong>Next.js</strong> و<strong>.NET Core</strong>، ويخدم هذا الموقع احتياجات العملاء والمشرفين معًا من خلال لوحة تحكم مرنة وواجهة مستخدم جذابة.
            </p>

            <hr style={{ margin: '2rem 0' }} />

            <h2>عن المطور</h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                تم تطوير هذا الموقع بواسطة <strong>رامي عيسى</strong> — مطور ويب بخبرة في بناء حلول متكاملة باستخدام تقنيات حديثة.
            </p>

            <ul style={{ marginTop: '1rem', lineHeight: '1.8', marginRight:'2rem' }}>
                <li><strong>الاسم:</strong> رامي عيسى</li>
                <li><strong>الهاتف:</strong> 0503332942</li>
                <li><strong>البريد الإلكتروني:</strong> <a href="mailto:ramifad@yahoo.com">ramifad@yahoo.com</a></li>
            </ul>
        </div>
    );
}
