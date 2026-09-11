import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';

const content = {
  fa: {
    title: 'حریم خصوصی و استفاده از سایت',
    intro: 'پیش از ارسال اطلاعات، با داده‌های درخواستی و کاربرد بخش‌های سایت آشنا شوید.',
    sections: [
      ['اطلاعات فرم‌ها', 'فرم تماس نام، شماره تماس، ایمیل اختیاری و متن پیام را دریافت می‌کند. در بخش نوبت‌گیری، اطلاعات هویتی و راه تماس برای پیگیری درخواست نوبت دریافت می‌شود.'],
      ['اطلاعات حساس پزشکی', 'فرم عمومی تماس برای ارسال مدارک پزشکی، رمز عبور، اطلاعات بانکی یا شرح مفصل سوابق محرمانه مناسب نیست. مدارک لازم برای ویزیت را در مسیر مورد تأیید کلینیک ارائه کنید.'],
      ['حساب کاربری و خدمات فنی', 'ورود به حساب و ثبت اطلاعات فرم‌ها از خدمات Base44 استفاده می‌کند. تنظیمات زبان در مرورگر شما ذخیره می‌شود. در دستگاه مشترک، پس از استفاده از حساب خارج شوید.'],
      ['کاربرد محتوای پزشکی', 'مطالب سایت برای معرفی خدمات و آمادگی مراجعه‌اند. تشخیص، تجویز و انتخاب روش درمان به ارزیابی فردی پزشک نیاز دارد. در وضعیت اورژانسی، منتظر پاسخ فرم یا نوبت اینترنتی نمانید و با خدمات فوریت‌های پزشکی محل خود تماس بگیرید.'],
      ['پیگیری اطلاعات ارسالی', 'برای پرسش درباره اطلاعاتی که ارسال کرده‌اید، از بخش تماس با کلینیک استفاده کنید. از درج دوباره جزئیات حساس در پیام عمومی خودداری کنید.'],
    ],
    contact: 'تماس با کلینیک',
  },
  en: {
    title: 'Privacy and Website Use',
    intro: 'Review the information requested by this site before submitting a form.',
    sections: [
      ['Information in forms', 'The contact form requests a name, phone number, optional email address and message. Appointment requests collect identity and contact details to follow up the request.'],
      ['Sensitive medical information', 'The public contact form is not intended for medical documents, passwords, banking details or detailed confidential medical history. Provide records through a channel confirmed by the clinic.'],
      ['Accounts and technical services', 'Account access and form records use Base44 services. Language settings are stored in your browser. Sign out after using an account on a shared device.'],
      ['Medical content', 'Website content introduces services and helps you prepare for a visit. Diagnosis, prescriptions and treatment decisions require individual clinical assessment. In an emergency, do not wait for a form reply or an online appointment; contact local emergency services.'],
      ['Questions about submitted information', 'Use the clinic contact page for questions about information you have submitted. Avoid repeating sensitive details in a public message.'],
    ],
    contact: 'Contact the clinic',
  },
  ar: {
    title: 'الخصوصية واستخدام الموقع',
    intro: 'تعرّف على المعلومات المطلوبة قبل إرسال أي نموذج.',
    sections: [
      ['معلومات النماذج', 'يطلب نموذج الاتصال الاسم ورقم الهاتف والبريد الإلكتروني الاختياري والرسالة. يطلب حجز الموعد بيانات الهوية والاتصال لمتابعة الطلب.'],
      ['المعلومات الطبية الحساسة', 'نموذج الاتصال العام غير مخصص للمستندات الطبية أو كلمات المرور أو البيانات البنكية أو التاريخ الطبي السري المفصل. قدّم السجلات عبر قناة تؤكدها العيادة.'],
      ['الحساب والخدمات التقنية', 'تستخدم الحسابات وسجلات النماذج خدمات Base44. تُحفظ إعدادات اللغة في المتصفح. سجّل الخروج بعد استخدام جهاز مشترك.'],
      ['المحتوى الطبي', 'يعرّف المحتوى بالخدمات ويساعد على الاستعداد للزيارة. يتطلب التشخيص والوصف العلاجي واختيار العلاج تقييمًا طبيًا فرديًا. في الطوارئ، لا تنتظر الرد على النموذج أو الموعد الإلكتروني؛ اتصل بخدمات الطوارئ المحلية.'],
      ['الاستفسار عن المعلومات المرسلة', 'استخدم صفحة الاتصال بالعيادة للاستفسار عن المعلومات التي أرسلتها، وتجنب تكرار التفاصيل الحساسة في الرسالة العامة.'],
    ],
    contact: 'اتصل بالعيادة',
  },
};

export default function Privacy() {
  const { lang } = useI18n();
  const page = content[lang];
  return <article className="mx-auto max-w-4xl px-6 py-12"><h1 className="font-display text-3xl font-extrabold leading-relaxed sm:text-4xl">{page.title}</h1><p className="mt-4 text-muted-foreground">{page.intro}</p><div className="mt-10 space-y-8">{page.sections.map(([heading, text]) => <section key={heading}><h2 className="text-xl font-bold">{heading}</h2><p className="mt-3 leading-loose text-muted-foreground">{text}</p></section>)}</div><Link to="/contact" className="mt-10 inline-block font-semibold text-primary underline underline-offset-4">{page.contact}</Link></article>;
}
