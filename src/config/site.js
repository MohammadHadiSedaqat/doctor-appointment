// Only verified practice information belongs here. Unknown details stay empty.
export const site = {
  name: { fa: 'دکتر فاضل صداقت', en: 'Dr. Fazel Sedaghat', ar: 'د. فاضل صداقت' },
  specialty: { fa: 'جراح و متخصص استخوان و مفاصل (ارتوپدی)', en: 'Orthopedic Surgeon', ar: 'اختصاصي جراحة العظام والمفاصل' },
  degree: { fa: 'دکترای حرفه‌ای پزشکی', en: 'Doctor of Medicine', ar: 'دكتوراه مهنية في الطب' },
  experienceYears: 33,
  url: import.meta.env.VITE_PUBLIC_SITE_URL || '',
  indexable: import.meta.env.VITE_SITE_INDEXABLE === 'true',
  phone: '025 37831456',
  email: '',
  address: {
    fa: 'دور شهر، روبروی پاساژ حریر، کوچه ۶.۱، ساختمان پزشکان سحر',
    en: 'Dour Shahr, opposite Harir Shopping Center, Alley 6.1, Sahar Medical Building',
    ar: 'دور شهر، مقابل مجمع حرير، زقاق ٦.١، مبنى سحر الطبي',
  },
  city: { fa: 'قم', en: 'Qom', ar: 'قم' },
  countryCode: 'IR',
  medicalLicense: '',
  mapUrl: '',
  mapEmbedUrl: '',
  portraitUrl: '',
  socialLinks: [],
  // Public reception hours; live appointment availability remains backend-owned.
  workingHours: [
    {
      id: 'sat-wed',
      day: { fa: 'شنبه تا چهارشنبه', en: 'Saturday–Wednesday', ar: 'السبت إلى الأربعاء' },
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      opens: '18:00',
      closes: '22:00',
    },
    {
      id: 'thu',
      day: { fa: 'پنجشنبه', en: 'Thursday', ar: 'الخميس' },
      dayOfWeek: ['Thursday'],
      opens: '18:00',
      closes: '21:00',
    },
  ],
};

export const getClinicAddress = (lang = 'fa') => [
  site.city[lang] || site.city.en,
  site.address[lang] || site.address.en,
].filter(Boolean).join(lang === 'en' ? ', ' : '، ');

export const getClinicPhoneHref = () => `tel:${site.phone.replace(/\s/g, '').replace(/^0/, '+98')}`;
