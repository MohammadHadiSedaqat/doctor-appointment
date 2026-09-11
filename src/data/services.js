// One editorial catalogue for the home page, service pages and local previews.
// Prices and durations are provisional; never use these records for a live booking.
/** @type {Array<[string, number, [string,string,string], [string,string,string], [string,string,string]]>} */
const records = [
  ['orthopedic-consultation', 30,
    ['معاینه و مشاوره تخصصی ارتوپدی', 'Orthopedic consultation', 'استشارة وفحص العظام'],
    ['بررسی درد، محدودیت حرکت و سابقه بیماری برای تعیین مسیر تشخیص و درمان.', 'Assessment of pain, mobility and medical history to plan further care.', 'تقييم الألم والحركة والتاريخ الطبي لتحديد مسار الرعاية.'],
    ['در این ویزیت، شرح حال و معاینه بالینی مبنای بررسی قرار می‌گیرد. همراه داشتن مدارک پزشکی و فهرست داروها به ارزیابی دقیق‌تر کمک می‌کند. در صورت نیاز، آزمایش یا تصویربرداری تکمیلی پیشنهاد می‌شود.', 'The visit begins with your medical history and a physical examination. Bring previous records and a medication list. Further tests or imaging may be recommended when needed.', 'تبدأ الزيارة بأخذ التاريخ الطبي والفحص السريري. يُنصح بإحضار التقارير السابقة وقائمة الأدوية، وقد تُطلب فحوص إضافية عند الحاجة.']],
  ['back-and-joint-pain', 30,
    ['ارزیابی کمردرد و آرتروز', 'Back pain and osteoarthritis assessment', 'تقييم آلام الظهر والفصال العظمي'],
    ['بررسی درد کمر و مفاصل و تأثیر آن بر فعالیت‌های روزمره.', 'Evaluation of back and joint pain and its effect on daily activities.', 'تقييم آلام الظهر والمفاصل وتأثيرها على الأنشطة اليومية.'],
    ['کمردرد و درد مفاصل می‌توانند علت‌های متفاوتی داشته باشند. پس از معاینه و بررسی مدارک، گزینه‌های درمانی و مراقبتی متناسب با شرایط فرد مطرح می‌شوند؛ تصمیم درباره جراحی به ارزیابی کامل نیاز دارد.', 'Back and joint pain can have different causes. Examination and relevant records guide discussion of treatment options. Decisions about surgery require a full individual assessment.', 'قد تكون لآلام الظهر والمفاصل أسباب مختلفة. تُناقش خيارات العلاج بعد الفحص ومراجعة التقارير، ويتطلب قرار الجراحة تقييمًا فرديًا كاملًا.']],
  ['orthopedic-injection', 20,
    ['تزریق دارویی با تجویز پزشک', 'Prescribed medication injection', 'حقن دوائي بوصفة الطبيب'],
    ['بررسی تجویز و انجام تزریق مرتبط با درمان ارتوپدی در صورت تأیید پزشک.', 'Review of a prescription and injection when clinically appropriate.', 'مراجعة الوصفة وإجراء الحقن عند ملاءمته طبيًا.'],
    ['نوع تزریق و مناسب بودن آن پس از بررسی وضعیت بیمار مشخص می‌شود. سابقه حساسیت دارویی، داروهای رقیق‌کننده خون و بیماری‌های زمینه‌ای را پیش از اقدام با پزشک در میان بگذارید.', 'The type and suitability of an injection are assessed individually. Tell the clinician about medication allergies, blood thinners and relevant medical conditions before treatment.', 'يُحدد نوع الحقن وملاءمته حسب حالة المريض. أخبر الطبيب عن الحساسية والأدوية المميعة للدم والأمراض المصاحبة قبل الإجراء.']],
  ['fracture-cast-care', 45,
    ['گچ‌گیری و مراقبت از شکستگی', 'Casting and fracture follow-up', 'التجبير ومتابعة الكسور'],
    ['ارزیابی آسیب، گچ‌گیری در صورت نیاز و پیگیری ترمیم استخوان.', 'Assessment of injury, casting when indicated and monitoring of healing.', 'تقييم الإصابة والتجبير عند الحاجة ومتابعة التئام العظم.'],
    ['انتخاب روش ثابت‌سازی به محل و نوع آسیب بستگی دارد. وضعیت پوست، گردش خون و حس اندام بررسی می‌شود و راهنمای مراقبت از گچ و زمان مراجعه بعدی توضیح داده خواهد شد.', 'Immobilization depends on the location and type of injury. Skin, circulation and sensation are assessed, followed by guidance on cast care and follow-up.', 'تعتمد طريقة التثبيت على نوع الإصابة وموقعها. يُفحص الجلد والدورة الدموية والإحساس، مع شرح العناية بالجبس والمتابعة.']],
  ['splint-removal', 25,
    ['آتل‌گذاری و باز کردن گچ یا آتل', 'Splinting and cast or splint removal', 'وضع الجبيرة وإزالة الجبس أو الجبيرة'],
    ['بررسی وضعیت اندام پیش از آتل‌گذاری، تعویض یا برداشتن آن.', 'Assessment before fitting, replacing or removing immobilization.', 'فحص الطرف قبل وضع التثبيت أو تبديله أو إزالته.'],
    ['زمان برداشتن گچ یا آتل با توجه به معاینه و روند ترمیم تعیین می‌شود. پس از باز کردن، محدودیت‌های فعالیت و نیاز احتمالی به تمرین یا توان‌بخشی بررسی خواهد شد.', 'Removal timing depends on examination and healing progress. Activity restrictions and any rehabilitation needs are reviewed afterwards.', 'يُحدد موعد الإزالة وفق الفحص وتقدم الالتئام، ثم تُراجع حدود النشاط والحاجة إلى التأهيل.']],
  ['medication-review', 20,
    ['بازبینی دارو و روند درمان', 'Medication and treatment review', 'مراجعة الأدوية ومسار العلاج'],
    ['مرور داروهای مصرفی، پاسخ به درمان و عوارض احتمالی.', 'Review of current medications, treatment response and possible side effects.', 'مراجعة الأدوية والاستجابة للعلاج والآثار الجانبية المحتملة.'],
    ['نام، مقدار و زمان مصرف داروها را همراه داشته باشید. تغییر یا قطع دارو با توجه به وضعیت بیمار و نظر پزشک انجام می‌شود؛ این مراجعه فرصتی برای طرح پرسش‌های مربوط به درمان است.', 'Bring medication names, doses and schedules. Any change is based on your circumstances and clinical advice. Use the visit to discuss questions about your treatment.', 'أحضر أسماء الأدوية وجرعاتها ومواعيدها. تُجرى التعديلات حسب حالتك ورأي الطبيب، ويمكنك طرح أسئلتك حول العلاج.']],
  ['lab-review', 20,
    ['بررسی آزمایش و تصویربرداری', 'Laboratory and imaging review', 'مراجعة التحاليل والتصوير'],
    ['تفسیر نتایج مرتبط با مشکلات استخوان و مفاصل در کنار معاینه و علائم.', 'Review of relevant results in the context of symptoms and examination.', 'تفسير النتائج المرتبطة بالعظام والمفاصل مع الأعراض والفحص.'],
    ['اصل گزارش‌ها و تصاویر قبلی، از جمله رادیوگرافی یا MRI در صورت وجود، را همراه بیاورید. نتایج به‌تنهایی تشخیص قطعی نیستند و در کنار شرح حال و معاینه ارزیابی می‌شوند.', 'Bring original reports and prior images, including X-rays or MRI if available. Results are interpreted alongside your history and examination rather than in isolation.', 'أحضر التقارير والصور السابقة، مثل الأشعة أو الرنين إن وجدت. تُفسر النتائج مع التاريخ الطبي والفحص وليس بصورة منفصلة.']],
  ['physiotherapy-follow-up', 25,
    ['پیگیری فیزیوتراپی و توان‌بخشی', 'Physiotherapy and rehabilitation review', 'متابعة العلاج الطبيعي والتأهيل'],
    ['ارزیابی پیشرفت حرکت، عملکرد اندام و پاسخ به برنامه توان‌بخشی.', 'Review of mobility, limb function and response to rehabilitation.', 'تقييم تحسن الحركة ووظيفة الطرف والاستجابة للتأهيل.'],
    ['گزارش فیزیوتراپی و تغییرات درد یا توانایی حرکت مرور می‌شود. ادامه یا اصلاح برنامه با توجه به روند بهبودی و هماهنگی با درمانگر بررسی خواهد شد.', 'Physiotherapy reports and changes in pain or movement are reviewed. Continuing or adjusting the plan depends on progress and coordination with your therapist.', 'تُراجع تقارير العلاج الطبيعي وتغيرات الألم والحركة، ويُبحث استمرار الخطة أو تعديلها وفق التقدم وبالتنسيق مع المعالج.']],
  ['postoperative-follow-up', 30,
    ['مراقبت پس از جراحی و تعویض مفصل', 'Postoperative and joint replacement follow-up', 'المتابعة بعد الجراحة واستبدال المفصل'],
    ['پیگیری وضعیت زخم، حرکت مفصل و بازگشت تدریجی به فعالیت.', 'Follow-up of the wound, joint movement and gradual return to activity.', 'متابعة الجرح وحركة المفصل والعودة التدريجية للنشاط.'],
    ['در مراجعه پس از جراحی، روند بهبودی و محدودیت‌های فعالیت بررسی می‌شود. گزارش عمل، خلاصه ترخیص و داروهای مصرفی را همراه داشته باشید. برنامه پیگیری برای هر بیمار به‌صورت فردی تعیین می‌شود.', 'Recovery and activity restrictions are reviewed after surgery. Bring the operation report, discharge summary and medication list. Follow-up is planned individually.', 'تُراجع مراحل التعافي وحدود النشاط بعد الجراحة. أحضر تقرير العملية وملخص الخروج وقائمة الأدوية، وتُحدد المتابعة لكل مريض على حدة.']],
];

export const services = records.map(([id, duration_minutes, names, descriptions, details]) => ({
  id, slug: id, duration_minutes, base_price: 1000, is_active: true, provisional: true,
  name_fa: names[0], name_en: names[1], name_ar: names[2],
  description_fa: descriptions[0], description_en: descriptions[1], description_ar: descriptions[2],
  detail_fa: details[0], detail_en: details[1], detail_ar: details[2],
}));
export const getService = (id) => services.find((service) => service.id === id);
