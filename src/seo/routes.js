import { site } from "@/config/site";
import { getService, services } from "@/data/services";
import { localizePath } from "@/i18n/locale";

export const seoLanguages = ["fa", "en", "ar"];

const copy = {
  fa: {
    home: {
      title: "دکتر فاضل صداقت | جراح و متخصص ارتوپدی",
      description: "دکتر فاضل صداقت، جراح و متخصص جراحی استخوان و مفاصل؛ ارزیابی و درمان کمردرد، آرتروز، آسیب‌های مفصلی و تعویض مفصل.",
    },
    about: { title: "درباره دکتر فاضل صداقت | متخصص ارتوپدی", description: "آشنایی با دکتر فاضل صداقت، جراح و متخصص جراحی استخوان و مفاصل و رویکرد علمی او در تشخیص و درمان بیماری‌های اسکلتی‌عضلانی." },
    qualifications: { title: "تحصیلات و مدارک | دکتر فاضل صداقت", description: "مسیر تحصیلی و مدارک حرفه‌ای ثبت‌شده برای دکتر فاضل صداقت، جراح و متخصص جراحی استخوان و مفاصل." },
    services: { title: "خدمات تخصصی ارتوپدی | دکتر فاضل صداقت", description: "خدمات ارزیابی، درمان و پیگیری کمردرد، آرتروز، آسیب‌های استخوان و مفصل و مراقبت‌های پس از جراحی." },
    clinic: { title: "کلینیک ارتوپدی | دکتر فاضل صداقت", description: "اطلاعات و راه‌های دسترسی به کلینیک ارتوپدی دکتر فاضل صداقت." },
    pricing: { title: "محاسبه هزینه ویزیت ارتوپدی | دکتر فاضل صداقت", description: "محاسبه شفاف هزینه خدمات ارتوپدی بر اساس خدمت انتخابی و پوشش بیمه." },
    contact: { title: "تماس با کلینیک ارتوپدی | دکتر فاضل صداقت", description: "برای هماهنگی و دریافت راهنمایی درباره خدمات ارتوپدی با کلینیک دکتر فاضل صداقت در تماس باشید." },
    appointment: { title: "دریافت نوبت ارتوپدی | دکتر فاضل صداقت", description: "درخواست نوبت برای ارزیابی و درمان مشکلات استخوان، مفصل و ستون فقرات." },
    privacy: { title: "حریم خصوصی و استفاده از سایت | دکتر فاضل صداقت", description: "اطلاعات درباره فرم‌ها، حساب کاربری، حریم خصوصی و کاربرد محتوای پزشکی وب‌سایت دکتر فاضل صداقت." },
  },
  en: {
    home: { title: "Dr. Fazel Sedaghat | Orthopedic Surgeon", description: "Dr. Fazel Sedaghat is an orthopedic surgeon focused on careful assessment and treatment of back pain, osteoarthritis, joint injuries and joint replacement." },
    about: { title: "About Dr. Fazel Sedaghat | Orthopedic Surgeon", description: "Learn about Dr. Fazel Sedaghat, his orthopedic surgery specialty and evidence-informed approach to musculoskeletal care." },
    qualifications: { title: "Education and Qualifications | Dr. Fazel Sedaghat", description: "Verified education and professional qualifications recorded for Dr. Fazel Sedaghat, orthopedic surgeon." },
    services: { title: "Orthopedic Services | Dr. Fazel Sedaghat", description: "Assessment, treatment and follow-up for back pain, osteoarthritis, bone and joint injuries and post-surgical care." },
    clinic: { title: "Orthopedic Clinic | Dr. Fazel Sedaghat", description: "Clinic information and directions for Dr. Fazel Sedaghat's orthopedic practice." },
    pricing: { title: "Orthopedic Visit Cost Calculator | Dr. Fazel Sedaghat", description: "Review an estimated visit cost based on the selected orthopedic service and insurance coverage." },
    contact: { title: "Contact the Orthopedic Clinic | Dr. Fazel Sedaghat", description: "Contact Dr. Fazel Sedaghat's clinic for scheduling and guidance about orthopedic services." },
    appointment: { title: "Book an Orthopedic Appointment | Dr. Fazel Sedaghat", description: "Request an appointment to assess and treat bone, joint and spine conditions." },
    privacy: { title: "Privacy and Website Use | Dr. Fazel Sedaghat", description: "Information about forms, accounts, privacy and the purpose of medical content on Dr. Fazel Sedaghat's website." },
  },
  ar: {
    home: { title: "د. فاضل صداقت | اختصاصي جراحة العظام", description: "د. فاضل صداقت، اختصاصي جراحة العظام والمفاصل، لتقييم وعلاج آلام الظهر والفصال العظمي وإصابات المفاصل واستبدال المفصل." },
    about: { title: "عن د. فاضل صداقت | اختصاصي جراحة العظام", description: "تعرّف على د. فاضل صداقت وتخصصه في جراحة العظام والمفاصل ونهجه في رعاية الجهاز العضلي الهيكلي." },
    qualifications: { title: "التعليم والمؤهلات | د. فاضل صداقت", description: "المؤهلات التعليمية والمهنية المسجلة للدكتور فاضل صداقت، اختصاصي جراحة العظام." },
    services: { title: "خدمات جراحة العظام | د. فاضل صداقت", description: "تقييم وعلاج ومتابعة آلام الظهر والفصال العظمي وإصابات العظام والمفاصل والرعاية بعد الجراحة." },
    clinic: { title: "عيادة جراحة العظام | د. فاضل صداقت", description: "معلومات العيادة وطرق الوصول إلى عيادة د. فاضل صداقت لجراحة العظام." },
    pricing: { title: "حساب تكلفة زيارة العظام | د. فاضل صداقت", description: "مراجعة التكلفة التقديرية حسب خدمة جراحة العظام والتغطية التأمينية." },
    contact: { title: "اتصل بعيادة العظام | د. فاضل صداقت", description: "تواصل مع عيادة د. فاضل صداقت للمواعيد والإرشاد حول خدمات جراحة العظام." },
    appointment: { title: "حجز موعد لجراحة العظام | د. فاضل صداقت", description: "اطلب موعدًا لتقييم وعلاج مشكلات العظام والمفاصل والعمود الفقري." },
    privacy: { title: "الخصوصية واستخدام الموقع | د. فاضل صداقت", description: "معلومات عن النماذج والحسابات والخصوصية واستخدام المحتوى الطبي في موقع د. فاضل صداقت." },
  },
};

const routeKinds = {
  "/": "home",
  "/about": "about",
  "/qualifications": "qualifications",
  "/services": "services",
  "/clinic": "clinic",
  "/pricing": "pricing",
  "/contact": "contact",
  "/appointment": "appointment",
  "/privacy": "privacy",
};

export const publicRoutes = ["/", "/about", "/qualifications", "/services", "/clinic", "/pricing", "/contact", "/privacy"];
export const publicPaths = [...publicRoutes, ...services.map((service) => `/services/${service.slug}`)];

const validLang = (lang) => (seoLanguages.includes(lang) ? lang : "fa");

const localizedField = (value, lang, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[lang] || value.fa || value.en || value.ar || fallback;
};

const serviceField = (service, field, lang, fallback = "") => localizedField(
  service?.[field] || {
    fa: service?.[`${field}_fa`],
    en: service?.[`${field}_en`],
    ar: service?.[`${field}_ar`],
  },
  lang,
  fallback,
);

function getLocalRouteCopy(kind, lang) {
  const current = copy[lang][kind];
  const city = site.city?.[lang];
  if (!city || !['home', 'clinic', 'contact'].includes(kind)) return current;
  const name = site.name[lang];
  const address = site.address?.[lang];
  const location = [city, address].filter(Boolean).join(lang === 'en' ? ', ' : '، ');
  const contact = site.phone ? {
    fa: ` تلفن هماهنگی: ${site.phone}.`,
    en: ` Contact: ${site.phone}.`,
    ar: ` هاتف التنسيق: ${site.phone}.`,
  }[lang] : '';
  const local = {
    fa: {
      home: { title: `${name} | جراح و متخصص ارتوپدی در ${city}`, description: `${name}، جراح و متخصص استخوان و مفاصل در ${city}؛ ارزیابی کمردرد، آرتروز، آسیب‌های مفصلی و مراقبت پس از تعویض مفصل.` },
      clinic: { title: `کلینیک ارتوپدی در ${city} | ${name}`, description: `آدرس کلینیک ${name}: ${location}. اطلاعات مراجعه و ساعات پذیرش.${contact}` },
      contact: { title: `تماس با کلینیک ارتوپدی در ${city} | ${name}`, description: `راه‌های ارتباط با کلینیک ${name} برای هماهنگی مراجعه و دریافت راهنمایی. آدرس: ${location}.${contact}` },
    },
    en: {
      home: { title: `${name} | Orthopedic Surgeon in ${city}`, description: `${name}, orthopedic surgeon in ${city}, for assessment of back pain, osteoarthritis and joint injuries, and follow-up after joint replacement.` },
      clinic: { title: `Orthopedic Clinic in ${city} | ${name}`, description: `${name}'s clinic: ${location}. View visiting information and opening hours.${contact}` },
      contact: { title: `Contact the Orthopedic Clinic in ${city} | ${name}`, description: `Contact ${name}'s clinic for scheduling and guidance. Address: ${location}.${contact}` },
    },
    ar: {
      home: { title: `${name} | اختصاصي جراحة العظام في ${city}`, description: `${name}، اختصاصي جراحة العظام والمفاصل في ${city}، لتقييم آلام الظهر والفصال العظمي وإصابات المفاصل والمتابعة بعد استبدال المفصل.` },
      clinic: { title: `عيادة جراحة العظام في ${city} | ${name}`, description: `عنوان عيادة ${name}: ${location}. معلومات الزيارة وساعات الاستقبال.${contact}` },
      contact: { title: `اتصل بعيادة العظام في ${city} | ${name}`, description: `تواصل مع عيادة ${name} للمواعيد والإرشاد. العنوان: ${location}.${contact}` },
    },
  };
  return local[lang][kind];
}

export function getRouteMeta(pathname, lang = "fa") {
  pathname = pathname.replace(/\/+$/, '') || '/';
  const locale = validLang(lang);
  const kind = routeKinds[pathname];
  if (kind) return { ...getLocalRouteCopy(kind, locale), kind, indexable: kind !== "appointment" };

  const match = pathname.match(/^\/services\/([^/]+)$/);
  if (match) {
    const service = getService(match[1]);
    if (!service) return { ...copy[locale].services, kind: "service", indexable: false, unknown: true };
    const name = serviceField(service, "name", locale, "Orthopedic service");
    const description = serviceField(service, "description", locale, serviceField(service, "detail", locale, copy[locale].services.description));
    return {
      title: `${name} | ${site.name[locale]}`,
      description,
      kind: "service",
      service,
      indexable: true,
    };
  }

  const privateTitles = {
    fa: { '/login': 'ورود', '/register': 'ثبت‌نام', '/forgot-password': 'بازیابی رمز عبور', '/reset-password': 'تغییر رمز عبور', '/dashboard': 'پنل کاربری' },
    en: { '/login': 'Login', '/register': 'Register', '/forgot-password': 'Password recovery', '/reset-password': 'Reset password', '/dashboard': 'Dashboard' },
    ar: { '/login': 'تسجيل الدخول', '/register': 'التسجيل', '/forgot-password': 'استعادة كلمة المرور', '/reset-password': 'تغيير كلمة المرور', '/dashboard': 'لوحة التحكم' },
  };
  const heading = privateTitles[locale][pathname] || { fa: 'صفحه پیدا نشد', en: 'Page not found', ar: 'الصفحة غير موجودة' }[locale];
  return { title: `${heading} | ${site.name[locale]}`, description: copy[locale].home.description, kind: "unknown", indexable: false, unknown: true };
}

export function getLocalizedPath(pathname, lang) {
  return localizePath(pathname, validLang(lang));
}

export function getSiteUrl(pathname = "/", lang) {
  if (!site.url) return "";
  try {
    const origin = new URL(site.url);
    if (origin.protocol !== "https:" || origin.username || origin.password || /^(localhost|127\.|0\.|\[::1\])/.test(origin.hostname) || /\.(test|local)$/.test(origin.hostname)) return "";
    const base = new URL(localizePath(pathname.replace(/\/+$/, '') || '/', validLang(lang)), origin.origin);
    return base.toString();
  } catch {
    return "";
  }
}

export const localizedCopy = copy;
