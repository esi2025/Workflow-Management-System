import { User, FormTemplate, FormSubmission } from './types';

export const INITIAL_USERS: User[] = [
  // Admin
  { id: '1', code: 'admin', name: 'مهندس اکبری (مدیر سیستم و الکترونیک)', role: 'admin', unit: 'عمومی', passwordHint: 'admin123' },
  
  // President/CEO
  { id: '2', code: '9001', name: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)', role: 'president', unit: 'عمومی', passwordHint: 'president9001' },
  
  // Managers
  { id: '10', code: '3001', name: 'دکتر علوی (مدیر ارشد فنی و مهندسی)', role: 'manager', unit: 'فنی و مهندسی', passwordHint: '123456' },
  { id: '11', code: '3002', name: 'آقای دکتر خسروی (مدیر امور قراردادها)', role: 'manager', unit: 'امور قراردادها', passwordHint: '123456' },
  { id: '12', code: '3003', name: 'خانم مهندس سلیمی (مدیر کنترل اسناد (Dcc))', role: 'manager', unit: 'کنترل اسناد (Dcc)', passwordHint: '123456' },
  
  // Supervisors
  { id: '20', code: '2001', name: 'مهندس رضایی (سرپرست دپارتمان فنی)', role: 'supervisor', unit: 'فنی و مهندسی', passwordHint: '123456' },
  { id: '21', code: '2002', name: 'آقای عباسی (سرپرست امور قراردادها)', role: 'supervisor', unit: 'امور قراردادها', passwordHint: '123456' },
  { id: '22', code: '2003', name: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)', role: 'supervisor', unit: 'کنترل اسناد (Dcc)', passwordHint: '123456' },
  
  // Experts / Staff
  { id: '101', code: '1001', name: 'علی حسینی (کارشناس ارشد انرژی)', role: 'staff', unit: 'فنی و مهندسی', passwordHint: '123456' },
  { id: '102', code: '1002', name: 'نرگس محمدی (کارشناس عمران و سازه)', role: 'staff', unit: 'فنی و مهندسی', passwordHint: '123456' },
  { id: '103', code: '1003', name: 'مرتضی کرمی (کارشناس ارشد حقوقی قراردادها)', role: 'staff', unit: 'امور قراردادها', passwordHint: '123456' },
  { id: '104', code: '1004', name: 'شیوا قاسمی (کارشناس ارزیابی مالی پیمان)', role: 'staff', unit: 'امور قراردادها', passwordHint: '123456' },
  { id: '105', code: '1005', name: 'پیمان حسنی (کارشناس آرشیو فنی اسناد Dcc)', role: 'staff', unit: 'کنترل اسناد (Dcc)', passwordHint: '123456' },
  { id: '106', code: '1006', name: 'زهرا هاشمی (کارشناس تطابق کدهای مستندسازی)', role: 'staff', unit: 'کنترل اسناد (Dcc)', passwordHint: '123456' }
];

export const INITIAL_TEMPLATES: FormTemplate[] = [
  {
    id: 'tech_work',
    title: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه',
    unit: 'فنی و مهندسی',
    createdAt: '2026-05-25',
    fields: [
      { id: 'proj_name', label: 'نام کامل پروژه یا کارگاه فعال', type: 'text', required: true },
      { id: 'progress_rate', label: 'درصد تقریبی پیشرفت فیزیکی کار', type: 'number', required: true },
      { id: 'tech_summary', label: 'توضیحات اقدامات انجام شده / خلاصه فعالیت برنامه ریزی شده برای روز کاری آینده.', type: 'textarea', required: true },
      { id: 'safety_check', label: 'تأیید رعایت کامل پروتکل‌ها و الزامات سازمانی کارگاه', type: 'checkbox', required: true }
    ]
  },
  {
    id: 'tech_calib',
    title: 'فرم درخواست کالیبراسیون تجهیزات فنی و ابزاردقیق',
    unit: 'فنی و مهندسی',
    createdAt: '2026-05-26',
    fields: [
      { id: 'device_name', label: 'عنوان و مدل دستگاه یا ابزار اندازه‌گیری', type: 'text', required: true },
      { id: 'device_code', label: 'شماره اموال یا کد شناسایی اختصاصی ابزار', type: 'text', required: true },
      { id: 'urgency_level', label: 'سطح اضطرار جهت کالیبراسیون مجدد', type: 'dropdown', required: true, options: ['بسیار فوری (توقف آزمایش)', 'عادی (پایش ادواری)', 'پیشگیرانه'] },
      { id: 'errors_noted', label: 'میزان خطای مشاهده شده یا علت نیاز به ارسال به آزمایشگاه مرجع', type: 'textarea', required: true }
    ]
  },
  {
    id: 'contract_review',
    title: 'فرم بررسی و تایید پیش‌نویس قراردادهای تجاری و الحاقیه',
    unit: 'امور قراردادها',
    createdAt: '2026-05-26',
    fields: [
      { id: 'contractor', label: 'نام کامل پیمانکار یا شرکت طرف قرارداد', type: 'text', required: true },
      { id: 'contract_value', label: 'مبلغ تقریبی قرارداد یا الحاقیه مربوطه (ریال)', type: 'number', required: true },
      { id: 'contract_type', label: 'دسته بندی قرارداد', type: 'dropdown', required: true, options: ['قرارداد پیمانکاری اجرایی عمومی', 'توافق‌نامه تأمین متریال و زنجیره خرید', 'قرارداد مشاوره و نظارت کارگاهی', 'الحاقیه تمدید زمانی موضوع قرارداد'] },
      { id: 'key_legal_points', label: 'ملاحظات حقوقی و تضامین درخواستی حسن انجام تعهدات', type: 'textarea', required: true }
    ]
  },
  {
    id: 'contract_clearance',
    title: 'فرم تایید مفاصاحساب و تسویه حساب قطعی پیمانکاران',
    unit: 'امور قراردادها',
    createdAt: '2026-05-27',
    fields: [
      { id: 'contract_no', label: 'شماره قرارداد مبنای تسویه', type: 'text', required: true },
      { id: 'final_invoice_amount', label: 'مبلغ نهایی تایید شده صورت‌وضعیت قطعی (ریال)', type: 'number', required: true },
      { id: 'clearance_reasons', label: 'شرح عملکرد تایید شده و گزارش خلاصه کسورات جریمه تأخیرات', type: 'textarea', required: true }
    ]
  },
  {
    id: 'dcc_transmittal',
    title: 'فرم ثبت و تایید ترانسمیتال نقشه‌های اسناد مهندسی',
    unit: 'کنترل اسناد (Dcc)',
    createdAt: '2026-05-27',
    fields: [
      { id: 'trans_code', label: 'کد استاندارد ترانسمیتال ارسالی (مثال: TX-FO-01)', type: 'text', required: true },
      { id: 'doc_count', label: 'تعداد کل مدارک و نقشه‌های ضمیمه شده', type: 'number', required: true },
      { id: 'doc_discipline', label: 'دیسیپلین مدارک ارسالی', type: 'dropdown', required: true, options: ['سازه و سیویل (Civil)', 'معماری (Architectural)', 'پایپینگ و مکانیکال (Piping)', 'برق و ابزاردقیق (Electrical)'] },
      { id: 'trans_comments', label: 'توضیحات تکمیلی یا الزامات ارسال رونوشت به سرشیفت', type: 'textarea', required: true }
    ]
  },
  {
    id: 'dcc_codification',
    title: 'فرم درخواست صدور کدهای مستندسازی و بازنگری نقشه‌ها',
    unit: 'کنترل اسناد (Dcc)',
    createdAt: '2026-05-28',
    fields: [
      { id: 'drawing_title', label: 'عنوان کامل نقشه یا پکیج مستندسازی', type: 'text', required: true },
      { id: 'revision_no', label: 'شماره بازنگری درخواستی (مثال: Rev. 02)', type: 'text', required: true },
      { id: 'change_nature', label: 'شرح تغییرات عمده اعمال شده در بازنگری جدید نقشه اداری', type: 'textarea', required: true }
    ]
  }
];

export const INITIAL_SUBMISSIONS: FormSubmission[] = [
  // --- فنی و مهندسی (10 Submissions) ---
  {
    id: 'tech_sub_1',
    templateId: 'tech_work',
    templateTitle: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه',
    unit: 'فنی و مهندسی',
    staffId: '101',
    staffName: 'علی حسینی',
    staffCode: '1001',
    createdAt: '2026-05-28 09:30',
    fieldsData: {
      proj_name: 'سد مخزنی آب راهبردی رودخانه هراز',
      progress_rate: 65,
      tech_summary: 'اتمام بتن‌ریزی شفت چپ تونل انحراف و آماده‌سازی برای پایش فشار سد. آزمایش هیدرولیکی اولیه با موفقیت انجام شد.',
      safety_check: true
    },
    attachment: { name: 'haraz_progress_report.pdf', size: '2.4 MB', type: 'application/pdf' },
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_supervisor'
  },
  {
    id: 'tech_sub_2',
    templateId: 'tech_calib',
    templateTitle: 'فرم درخواست کالیبراسیون تجهیزات فنی و ابزاردقیق',
    unit: 'فنی و مهندسی',
    staffId: '101',
    staffName: 'علی حسینی',
    staffCode: '1001',
    createdAt: '2026-05-28 11:15',
    fieldsData: {
      device_name: 'دستگاه گشتاورسنج دیجیتال های‌تک لایکا',
      device_code: 'EQ-992-LAI',
      urgency_level: 'بسیار فوری (توقف آزمایش)',
      errors_noted: 'مغایرت بیش از ۴.۵ درصدی مابین ارقام لود سل دستگاه با مقادیر مرجع پارت بورد که خطرساز است.'
    },
    attachment: null,
    supervisorComment: 'تثبیت و تایید می‌شود. با توجه به حساسیت پروژه سد هراز، فوراً برای کالیبراسیون هماهنگی کنید.',
    supervisorApprovedAt: '2026-05-28 12:40',
    supervisorName: 'مهندس رضایی (سرپرست دپارتمان فنی)',
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_manager'
  },
  {
    id: 'tech_sub_3',
    templateId: 'tech_work',
    templateTitle: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه',
    unit: 'فنی و مهندسی',
    staffId: '102',
    staffName: 'نرگس محمدی',
    staffCode: '1002',
    createdAt: '2026-05-27 10:10',
    fieldsData: {
      proj_name: 'طراحی اسکلت فلزی بیمارستان ۱۰۰ تختخوابی بهشهر',
      progress_rate: 90,
      tech_summary: 'تکمیل شبیه‌سازی لرزه‌ای سازه و اصلاح ضخامت ورق‌های ستون‌های تقویتی فونداسیون.',
      safety_check: true
    },
    attachment: null,
    supervisorComment: 'مسائل سازه‌ای به طور دقیق بررسی شد و کیفیت بارهای لرزه‌یی کاملا با مقررات همخوانی دارد.',
    supervisorApprovedAt: '2026-05-27 11:30',
    supervisorName: 'مهندس رضایی (سرپرست دپارتمان فنی)',
    managerComment: 'تایید است، جهت صدور دستور پرداخت نهایی به کارتابل ریاست ارجاع داده می‌شود.',
    managerApprovedAt: '2026-05-27 15:45',
    managerName: 'دکتر علوی (مدیر ارشد فنی و مهندسی)',
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_president'
  },
  {
    id: 'tech_sub_4',
    templateId: 'tech_calib',
    templateTitle: 'فرم درخواست کالیبراسیون تجهیزات فنی و ابزاردقیق',
    unit: 'فنی و مهندسی',
    staffId: '102',
    staffName: 'نرگس محمدی',
    staffCode: '1002',
    createdAt: '2026-05-26 14:20',
    fieldsData: {
      device_name: 'سنسور ارتعاش‌سنج چرخ‌دنده توربین توربو',
      device_code: 'SEN-VIB-552',
      urgency_level: 'عادی (پایش ادوارد)',
      errors_noted: 'نیاز به کالیبراسیون سالانه جهت پایداری سنسور مخابراتی نیروگاه قشم.'
    },
    attachment: null,
    supervisorComment: 'تا پایان ماه جاری فرصت وجود دارد و با هماهنگی نیروگاه ارسال شود.',
    supervisorApprovedAt: '2026-05-26 16:10',
    supervisorName: 'مهندس رضایی (سرپرست دپارتمان فنی)',
    managerComment: 'اقدام مناسب انجام پذیرد. کالیبراسیون در آزمایشگاه مرجع همکار تایید گردید.',
    managerApprovedAt: '2026-05-27 08:30',
    managerName: 'دکتر علوی (مدیر ارشد فنی و مهندسی)',
    presidentComment: 'بسیار خوب، تامین هزینه این کار از سرفصل پایش فنی مورد موافقت است.',
    presidentApprovedAt: '2026-05-27 11:00',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president',
    rating: 5
  },
  {
    id: 'tech_sub_5',
    templateId: 'tech_work',
    templateTitle: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه',
    unit: 'فنی و مهندسی',
    staffId: '101',
    staffName: 'علی حسینی',
    staffCode: '1001',
    createdAt: '2026-05-25 08:00',
    fieldsData: {
      proj_name: 'طرح توسعه تصفیه‌خانه ارومیه',
      progress_rate: 40,
      tech_summary: 'حفاری مسیر انتقال پساب پیشرفت ملایمی داشته اما برخورد با بافت متراکم سنگی سرعت کار را کاهش داده است.',
      safety_check: true
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'draft'
  },
  {
    id: 'tech_sub_6',
    templateId: 'tech_work',
    templateTitle: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه',
    unit: 'فنی و مهندسی',
    staffId: '102',
    staffName: 'نرگس محمدی',
    staffCode: '1002',
    createdAt: '2026-05-24 16:30',
    fieldsData: {
      proj_name: 'برج اداری هلدینگ راه و ساختمان پایتخت',
      progress_rate: 82,
      tech_summary: 'اجرای کامل نمای کرتن‌وال طبقات ۱۰ تا ۱۴ به اتمام رسید و زیربنای کامپوزیت کاملاً مهیا است.',
      safety_check: true
    },
    attachment: null,
    supervisorComment: 'نقایص اندک در مفاصل جوش پیچ نما دیده می‌شود که نیاز به تعویض فوری واشرها دارد.',
    supervisorApprovedAt: '2026-05-25 10:00',
    supervisorName: 'مهندس رضایی (سرپرست دپارتمان فنی)',
    managerComment: 'توصیه‌های سرپرست کارورز بررسی شد و مهاربندها با دقت بالایی اجرا شده‌اند.',
    managerApprovedAt: '2026-05-25 14:00',
    managerName: 'دکتر علوی (مدیر ارشد فنی و مهندسی)',
    presidentComment: 'آفرین به تیم مجریان برج پایتخت. پاداش سرعت عمل کار در پرونده پیمانکار منظور شود.',
    presidentApprovedAt: '2026-05-25 16:20',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president',
    rating: 4
  },
  {
    id: 'tech_sub_7',
    templateId: 'tech_calib',
    templateTitle: 'فرم درخواست کالیبراسیون تجهیزات فنی و ابزاردقیق',
    unit: 'فنی و مهندسی',
    staffId: '101',
    staffName: 'علی حسینی',
    staffCode: '1001',
    createdAt: '2026-05-24 12:00',
    fieldsData: {
      device_name: 'ترمومتر الکترونیکی مخازن گالوانیزه سد',
      device_code: 'TM-HE-212',
      urgency_level: 'عادی (پایش ادوات)',
      errors_noted: 'نوسان خوانش مابین ۱.۵ تا ۲ درجه سانتی‌گراد در دماهای بالای ۸۰ درجه.'
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_supervisor'
  },
  {
    id: 'tech_sub_8',
    templateId: 'tech_work',
    templateTitle: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه',
    unit: 'فنی و مهندسی',
    staffId: '102',
    staffName: 'نرگس محمدی',
    staffCode: '1002',
    createdAt: '2026-05-23 15:50',
    fieldsData: {
      proj_name: 'خط انتقال گاز سرخس به فریمان',
      progress_rate: 35,
      tech_summary: 'جوشکاری مداوم و عایقکاری پلی‌اتیلنی لوله‌های ۴۲ اینچ فولادی در شرایط آب و هوایی سخت منطقه.',
      safety_check: true
    },
    attachment: null,
    supervisorComment: 'بازرسی‌های رادیوگرافی (RT) عیوب ناچیز را نشان داد که بازسازی و تعلیق کار حل شد.',
    supervisorApprovedAt: '2026-05-24 09:00',
    supervisorName: 'مهندس رضایی (سرپرست دپارتمان فنی)',
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_manager'
  },
  {
    id: 'tech_sub_9',
    templateId: 'tech_calib',
    templateTitle: 'فرم درخواست کالیبراسیون تجهیزات فنی و ابزاردقیق',
    unit: 'فنی و مهندسی',
    staffId: '101',
    staffName: 'علی حسینی',
    staffCode: '1001',
    createdAt: '2026-05-23 11:30',
    fieldsData: {
      device_name: 'تراز لیزری ۳۶۰ درجه سنترونیک',
      device_code: 'LV-CE-11',
      urgency_level: 'پیشگیرانه',
      errors_noted: 'کنترل خط فرضی جهت حصول اطمینان کالیبره سالانه کارخانه همکار.'
    },
    attachment: null,
    supervisorComment: 'دستگاه کاملا دقیق است اما برای پایش کلی به واحد پشتیبانی ارجاع گردید.',
    supervisorApprovedAt: '2026-05-23 14:10',
    supervisorName: 'مهندس رضایی (سرپرست دپارتمان فنی)',
    managerComment: 'تایید می‌شود. اقدام لازم انجام گردد.',
    managerApprovedAt: '2026-05-24 11:00',
    managerName: 'دکتر علوی (مدیر ارشد فنی و مهندسی)',
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_president'
  },
  {
    id: 'tech_sub_10',
    templateId: 'tech_work',
    templateTitle: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه',
    unit: 'فنی و مهندسی',
    staffId: '102',
    staffName: 'نرگس محمدی',
    staffCode: '1002',
    createdAt: '2026-05-22 09:00',
    fieldsData: {
      proj_name: 'طراحی فاز دو تصفیه‌خانه نمک‌زدایی مکران',
      progress_rate: 100,
      tech_summary: 'ارایه نهایی دفترچه‌های محاسباتی فلو و کاتالوگ پمپ‌های سانتریفیوژ فشار قوی تامین برند ایده ال.',
      safety_check: true
    },
    attachment: null,
    supervisorComment: 'تمام مدارک ارسالی با استاندارد تطبیق کامل دارد و کار این فاز به کمال رسید.',
    supervisorApprovedAt: '2026-05-22 13:00',
    supervisorName: 'مهندس رضایی (سرپرست دپارتمان فنی)',
    managerComment: 'بسیار خرسندیم از زحمات بی وقفه همکاران واحد فنی در به ثمر نشستن این پروژه مهم ملی.',
    managerApprovedAt: '2026-05-22 15:30',
    managerName: 'دکتر علوی (مدیر ارشد فنی و مهندسی)',
    presidentComment: 'کار ماندگاری در سواحل مکران رقم خورد. تقدیرنامه کتبی صادر شود و در بایگانی قرار گیرد.',
    presidentApprovedAt: '2026-05-23 10:00',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  },

  // --- امور قراردادها (10 Submissions) ---
  {
    id: 'cnt_sub_1',
    templateId: 'contract_review',
    templateTitle: 'فرم بررسی و تایید پیش‌نویس قراردادهای تجاری و الحاقیه',
    unit: 'امور قراردادها',
    staffId: '103',
    staffName: 'مرتضی کرمی',
    staffCode: '1003',
    createdAt: '2026-05-28 08:30',
    fieldsData: {
      contractor: 'شرکت راه و ابنیه سدید ایرانیان',
      contract_value: 12500000000,
      contract_type: 'قرارداد پیمانکاری اجرایی عمومی',
      key_legal_points: 'ضمانتنامه بانکی معادل ۱۰ درصد کل قرارداد از بانک تجارت اخذ شده و بند جریمه تاخیرات روزانه ۵۰ میلیون ریال منظور شده است.'
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_supervisor'
  },
  {
    id: 'cnt_sub_2',
    templateId: 'contract_clearance',
    templateTitle: 'فرم تایید مفاصاحساب و تسویه حساب قطعی پیمانکاران',
    unit: 'امور قراردادها',
    staffId: '103',
    staffName: 'مرتضی کرمی',
    staffCode: '1003',
    createdAt: '2026-05-28 10:00',
    fieldsData: {
      contract_no: 'CO-403-99/IND',
      final_invoice_amount: 430000000,
      clearance_reasons: 'پیمانکار کلیه خدمات موضوع نصب اسکلت سوله شماره ۴ کارگاه را با موفقیت تمام کرده و نامه مفاصاحساب بیمه تامین اجتماعی نیز ضمیمه گردید.'
    },
    attachment: { name: 'social_security_clearance.pdf', size: '1.5 MB', type: 'application/pdf' },
    supervisorComment: 'تایید می‌شود. مفاصاحساب اخذ شده و سپرده حسن انجام کار مابقی پس از دوره تضمین آزاد گردد.',
    supervisorApprovedAt: '2026-05-28 13:00',
    supervisorName: 'آقای عباسی (سرپرست امور قراردادها)',
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_manager'
  },
  {
    id: 'cnt_sub_3',
    templateId: 'contract_review',
    templateTitle: 'فرم بررسی و تایید پیش‌نویس قراردادهای تجاری و الحاقیه',
    unit: 'امور قراردادها',
    staffId: '104',
    staffName: 'شیوا قاسمی',
    staffCode: '1004',
    createdAt: '2026-05-27 14:10',
    fieldsData: {
      contractor: 'شرکت پتروشیمی لردگان (تأمین مواد اولیه)',
      contract_value: 32000000000,
      contract_type: 'توافق‌نامه تأمین متریال و زنجیره خرید',
      key_legal_points: 'اخذ گواهی ارزیابی کیفی، تاییدیه مراجع ذیصلاح و اعمال شرایط پرداخت چکی سه‌ماهه.'
    },
    attachment: null,
    supervisorComment: 'بررسی‌های اعتباری عالی بود. شرایط پرداخت سه‌ماهه بسیار برای نقدینگی سازمان مناسب است.',
    supervisorApprovedAt: '2026-05-27 16:00',
    supervisorName: 'آقای عباسی (سرپرست امور قراردادها)',
    managerComment: 'تایید می‌گردد. الحاقیه خرید متریال فولادی بسیار راهبردی است.',
    managerApprovedAt: '2026-05-28 09:15',
    managerName: 'آقای دکتر خسروی (مدیر امور قراردادها)',
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_president'
  },
  {
    id: 'cnt_sub_4',
    templateId: 'contract_clearance',
    templateTitle: 'فرم تایید مفاصاحساب و تسویه حساب قطعی پیمانکاران',
    unit: 'امور قراردادها',
    staffId: '104',
    staffName: 'شیوا قاسمی',
    staffCode: '1004',
    createdAt: '2026-05-26 11:30',
    fieldsData: {
      contract_no: 'CO-1102-SYS',
      final_invoice_amount: 1800000000,
      clearance_reasons: 'تکمیل صد در صدی قرارداد توسعه زیرساخت فیبر نوری دفتر کارگاه زنجان و تحویل قطعی گزارش تست فلوک.'
    },
    attachment: null,
    supervisorComment: 'صورت‌جلسه تحویل به تایید کارشناس مقیم رسیده و آماده پرداخت است.',
    supervisorApprovedAt: '2026-05-26 14:00',
    supervisorName: 'آقای عباسی (سرپرست امور قراردادها)',
    managerComment: 'پرداخت کلیه مبالغ بلامانع است.',
    managerApprovedAt: '2026-05-26 16:00',
    managerName: 'آقای دکتر خسروی (مدیر امور قراردادها)',
    presidentComment: 'مورد تایید است. از منابع تنخواه جاری پرداخت نهایی صورت گیرد.',
    presidentApprovedAt: '2026-05-27 10:15',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  },
  {
    id: 'cnt_sub_5',
    templateId: 'contract_review',
    templateTitle: 'فرم بررسی و تایید پیش‌نویس قراردادهای تجاری و الحاقیه',
    unit: 'امور قراردادها',
    staffId: '103',
    staffName: 'مرتضی کرمی',
    staffCode: '1003',
    createdAt: '2026-05-25 15:00',
    fieldsData: {
      contractor: 'فروشگاه آلومینیوم صدف تهران',
      contract_value: 890000000,
      contract_type: 'توافق‌نامه تأمین متریال و زنجیره خرید',
      key_legal_points: 'پرداخت نقد و تحویل فوری در محل کارخانه تهران.'
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'draft'
  },
  {
    id: 'cnt_sub_6',
    templateId: 'contract_clearance',
    templateTitle: 'فرم تایید مفاصاحساب و تسویه حساب قطعی پیمانکاران',
    unit: 'امور قراردادها',
    staffId: '103',
    staffName: 'مرتضی کرمی',
    staffCode: '1003',
    createdAt: '2026-05-25 09:30',
    fieldsData: {
      contract_no: 'CO-99-A/DECOR',
      final_invoice_amount: 120000000,
      clearance_reasons: 'تسویه بابت طراحی دکوراسیون سالن ورودی کنفرانس پتروشیمی عسلویه.'
    },
    attachment: null,
    supervisorComment: 'دکوراسیون با رضایت کامل کارفرمای محترم تحویل داده شد و ایرادی گزارش نشده است.',
    supervisorApprovedAt: '2026-05-25 11:30',
    supervisorName: 'آقای عباسی (سرپرست امور قراردادها)',
    managerComment: 'موافقت انجام شد.',
    managerApprovedAt: '2026-05-25 14:00',
    managerName: 'آقای دکتر خسروی (مدیر امور قراردادها)',
    presidentComment: 'امضا و موافقت شد. سند بایگانی گردد.',
    presidentApprovedAt: '2026-05-26 09:00',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  },
  {
    id: 'cnt_sub_7',
    templateId: 'contract_review',
    templateTitle: 'فرم بررسی و تایید پیش‌نویس قراردادهای تجاری و الحاقیه',
    unit: 'امور قراردادها',
    staffId: '104',
    staffName: 'شیوا قاسمی',
    staffCode: '1004',
    createdAt: '2026-05-24 11:00',
    fieldsData: {
      contractor: 'شرکت عایق‌سازی طوس البرز',
      contract_value: 4500000000,
      contract_type: 'قرارداد پیمانکاری اجرایی عمومی',
      key_legal_points: 'پیش‌بینی اعمال بیمه کارگاه به عنوان یکی از کسورات قانونی مستقیم مابین طرفین.'
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_supervisor'
  },
  {
    id: 'cnt_sub_8',
    templateId: 'contract_clearance',
    templateTitle: 'فرم تایید مفاصاحساب و تسویه حساب قطعی پیمانکاران',
    unit: 'امور قراردادها',
    staffId: '104',
    staffName: 'شیوا قاسمی',
    staffCode: '1004',
    createdAt: '2026-05-23 16:00',
    fieldsData: {
      contract_no: 'CO-212-PUMP',
      final_invoice_amount: 670000000,
      clearance_reasons: 'صورتحساب قطعی خرید و اورهال ۲ دستگاه الکتروپمپ انتقال کثافت آبگیر تصفیه‌خانه.'
    },
    attachment: null,
    supervisorComment: 'تایید می‌شود. پمپ‌ها استارت شده و بدون سر و صدا کارایی مطلوب کاتالوگ را دارند.',
    supervisorApprovedAt: '2026-05-24 09:12',
    supervisorName: 'آقای عباسی (سرپرست امور قراردادها)',
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_manager'
  },
  {
    id: 'cnt_sub_9',
    templateId: 'contract_review',
    templateTitle: 'فرم بررسی و تایید پیش‌نویس قراردادهای تجاری و الحاقیه',
    unit: 'امور قراردادها',
    staffId: '103',
    staffName: 'مرتضی کرمی',
    staffCode: '1003',
    createdAt: '2026-05-23 10:30',
    fieldsData: {
      contractor: 'مهندسین مشاور سازه‌اندیشان زاگرس',
      contract_value: 1900000000,
      contract_type: 'قرارداد مشاوره و نظارت کارگاهی',
      key_legal_points: 'پرداخت اقساط ماهیانه مشروط به ارایه گزارش ماهانه پیشرفت کار و تایید ناظر کارگاه.'
    },
    attachment: null,
    supervisorComment: 'بسیار کامل و قانونی است. ریسک بندهای پرداخت به خوبی به نفع منافع کارفرما پوشش داده شده.',
    supervisorApprovedAt: '2026-05-23 12:45',
    supervisorName: 'آقای عباسی (سرپرست امور قراردادها)',
    managerComment: 'جهت صدور دستورات مالی مقتضی برای مشاور ارشد ارسال می‌شود.',
    managerApprovedAt: '2026-05-23 15:00',
    managerName: 'آقای دکتر خسروی (مدیر امور قراردادها)',
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_president'
  },
  {
    id: 'cnt_sub_10',
    templateId: 'contract_clearance',
    templateTitle: 'فرم تایید مفاصاحساب و تسویه حساب قطعی پیمانکاران',
    unit: 'امور قراردادها',
    staffId: '104',
    staffName: 'شیوا قاسمی',
    staffCode: '1004',
    createdAt: '2026-05-22 14:00',
    fieldsData: {
      contract_no: 'CO-GEO-O4',
      final_invoice_amount: 290000000,
      clearance_reasons: 'تکمیل عملیات ژئوفیزیک و خاک سنجی مسیر تونل انحراف رودخانه تجن.'
    },
    attachment: null,
    supervisorComment: 'نقشه‌ها و گزارش نهایی آزمایش خاک تحویل گرفته شد و تایید است.',
    supervisorApprovedAt: '2026-05-22 16:30',
    supervisorName: 'آقای عباسی (سرپرست امور قراردادها)',
    managerComment: 'مورد موافقت قرار گرفت. تسویه قطعی است.',
    managerApprovedAt: '2026-05-23 09:30',
    managerName: 'آقای دکتر خسروی (مدیر امور قراردادها)',
    presidentComment: 'مبلغ نهایی پرداخت شود. تسویه حساب قطعی مختومه ثبت گردد.',
    presidentApprovedAt: '2026-05-23 13:00',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  },

  // --- کنترل اسناد Dcc (10 Submissions) ---
  {
    id: 'dcc_sub_1',
    templateId: 'dcc_transmittal',
    templateTitle: 'فرم ثبت و تایید ترانسمیتال نقشه‌های اسناد مهندسی',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '105',
    staffName: 'پیمان حسنی',
    staffCode: '1005',
    createdAt: '2026-05-28 09:12',
    fieldsData: {
      trans_code: 'TX-KRG-ME-0453',
      doc_count: 14,
      doc_discipline: 'پایپینگ و مکانیکال (Piping)',
      trans_comments: 'مدارک ایزومتریک خطوط انتقال بخار ردیف‌های فرعی بویلر نیروگاه زرجان که به تایید نماینده مشاور رسیده است.'
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_supervisor'
  },
  {
    id: 'dcc_sub_2',
    templateId: 'dcc_codification',
    templateTitle: 'فرم درخواست صدور کدهای مستندسازی و بازنگری نقشه‌ها',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '105',
    staffName: 'پیمان حسنی',
    staffCode: '1005',
    createdAt: '2026-05-28 11:30',
    fieldsData: {
      drawing_title: 'چیدمان الکتریکال پست برق زمینی مجتمع مسکونی مهراد',
      revision_no: 'Rev. 03',
      change_nature: 'تغییر بورد خازن‌ها بر اساس محاسبات لرزه‌ای جدید و اصلاح مسیر داکت کابل‌های فشار متوسط.'
    },
    attachment: null,
    supervisorComment: 'تغییرات با محاسبات مهندسی پروژه تطبیق داده شد و ارایه استاندارد Dcc مورد تایید است.',
    supervisorApprovedAt: '2026-05-28 14:00',
    supervisorName: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)',
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_manager'
  },
  {
    id: 'dcc_sub_3',
    templateId: 'dcc_transmittal',
    templateTitle: 'فرم ثبت و تایید ترانسمیتال نقشه‌های اسناد مهندسی',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '106',
    staffName: 'زهرا هاشمی',
    staffCode: '1006',
    createdAt: '2026-05-27 15:00',
    fieldsData: {
      trans_code: 'TX-ABH-ST-9922',
      doc_count: 5,
      doc_discipline: 'سازه و سیویل (Civil)',
      trans_comments: 'پیش‌نویس نهایی نقشه‌های شاپ دراوینگ بیس‌پلیت مخازن نمک شرکت مکران.'
    },
    attachment: null,
    supervisorComment: 'اسناد مربوطه با کدگذاری استانداردهای ایزو منطبق است.',
    supervisorApprovedAt: '2026-05-27 16:30',
    supervisorName: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)',
    managerComment: 'اسناد ترنسمیتال مکران تایید اساسی شد، ارسال شود.',
    managerApprovedAt: '2026-05-28 10:15',
    managerName: 'خانم مهندس سلیمی (مدیر کنترل اسناد (Dcc))',
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_president'
  },
  {
    id: 'dcc_sub_4',
    templateId: 'dcc_codification',
    templateTitle: 'فرم درخواست صدور کدهای مستندسازی و بازنگری نقشه‌ها',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '106',
    staffName: 'زهرا هاشمی',
    staffCode: '1006',
    createdAt: '2026-05-26 10:30',
    fieldsData: {
      drawing_title: 'برنامه زمان‌بندی کلان احداث مسیر فیبر نوری مکران',
      revision_no: 'Rev. 01',
      change_nature: 'اعمال فواصل زمانی توقف کارگاهی زمستانه در نقاط کوهستانی جاده مکران.'
    },
    attachment: { name: 'mackeran_plan_opt.xlsx', size: '1.1 MB', type: 'application/octet-stream' },
    supervisorComment: 'تقویم با آخرین صورت‌جلسات تطبیق داده شد و مغایرتی ندارد.',
    supervisorApprovedAt: '2026-05-26 12:00',
    supervisorName: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)',
    managerComment: 'زمان‌بندی تازه و پیش‌بین‌ها کاملا مهندسی و هوشمندانه است.',
    managerApprovedAt: '2026-05-26 15:00',
    managerName: 'خانم مهندس سلیمی (مدیر کنترل اسناد (Dcc))',
    presidentComment: 'بسیار خوب، زمان‌بندی بازنگری شماره ۱ به عنوان مرجع پیشرفت پروژه ابلاغ شود.',
    presidentApprovedAt: '2026-05-27 09:30',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  },
  {
    id: 'dcc_sub_5',
    templateId: 'dcc_transmittal',
    templateTitle: 'فرم ثبت و تایید ترانسمیتال نقشه‌های اسناد مهندسی',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '105',
    staffName: 'پیمان حسنی',
    staffCode: '1005',
    createdAt: '2026-05-25 11:30',
    fieldsData: {
      trans_code: 'TX-FO-LOCAL-10',
      doc_count: 2,
      doc_discipline: 'معماری (Architectural)',
      trans_comments: 'نقشه‌های دیوارهای جداکننده گچی سالن اصلی کارگاه البرز.'
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'draft'
  },
  {
    id: 'dcc_sub_6',
    templateId: 'dcc_codification',
    templateTitle: 'فرم درخواست صدور کدهای مستندسازی و بازنگری نقشه‌ها',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '105',
    staffName: 'پیمان حسنی',
    staffCode: '1005',
    createdAt: '2026-05-25 08:30',
    fieldsData: {
      drawing_title: 'نقشه مکانیکال و مسیر تخلیه دود موتورخانه مرکزی شرکت',
      revision_no: 'Rev. 00',
      change_nature: 'تهیه و انتشار پکیج مدارک ساخت به عنوان نقشه نسخه اولیه مبنای اجرا.'
    },
    attachment: null,
    supervisorComment: 'تایید می‌شود، نقشه جدید آماده توزیع بین تکنسین‌های اجرایی است.',
    supervisorApprovedAt: '2026-05-25 10:15',
    supervisorName: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)',
    managerComment: 'مورد تایید است. از کیفیت نقشه و کدهای استاندارد صادر شده اطمینان حاصل شد.',
    managerApprovedAt: '2026-05-25 12:45',
    managerName: 'خانم مهندس سلیمی (مدیر کنترل اسناد (Dcc))',
    presidentComment: 'امضاء قطعی پورتال صادر گردید. در پرونده آرشیو دسیپلین تاسیسات بایگانی شود.',
    presidentApprovedAt: '2026-05-25 15:30',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  },
  {
    id: 'dcc_sub_7',
    templateId: 'dcc_transmittal',
    templateTitle: 'فرم ثبت و تایید ترانسمیتال نقشه‌های اسناد مهندسی',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '106',
    staffName: 'زهرا هاشمی',
    staffCode: '1006',
    createdAt: '2026-05-24 10:00',
    fieldsData: {
      trans_code: 'TX-HSE-CO-22',
      doc_count: 1,
      doc_discipline: 'سازه و سیویل (Civil)',
      trans_comments: 'سند پروتکل اکیپ‌های فعال نصب ورق کف مخازن کارگاه البرز.'
    },
    attachment: null,
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_supervisor'
  },
  {
    id: 'dcc_sub_8',
    templateId: 'dcc_codification',
    templateTitle: 'فرم درخواست صدور کدهای مستندسازی و بازنگری نقشه‌ها',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '106',
    staffName: 'زهرا هاشمی',
    staffCode: '1006',
    createdAt: '2026-05-23 15:30',
    fieldsData: {
      drawing_title: 'نمای سه بعدی نقشه سایت‌پلان مخازن ثانویه هرمزگان',
      revision_no: 'Rev. 04',
      change_nature: 'اصلاح نهایی کریدور غربی انتقال گاز در مجاورت فنس فونداسیون مخازن.'
    },
    attachment: null,
    supervisorComment: 'اصلاحات هندسی دقیقاً انجام شده و با کد مرجع همخوانی کامل دارد.',
    supervisorApprovedAt: '2026-05-24 09:00',
    supervisorName: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)',
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_manager'
  },
  {
    id: 'dcc_sub_9',
    templateId: 'dcc_transmittal',
    templateTitle: 'فرم ثبت و تایید ترانسمیتال نقشه‌های اسناد مهندسی',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '105',
    staffName: 'پیمان حسنی',
    staffCode: '1005',
    createdAt: '2026-05-23 10:00',
    fieldsData: {
      trans_code: 'TX-ELECT-99-B',
      doc_count: 8,
      doc_discipline: 'برق و ابزاردقیق (Electrical)',
      trans_comments: 'پکیج مدارک تک‌خطی تابلوهای برق کنترلی PLC واحد شماره ۲ سد هراز.'
    },
    attachment: null,
    supervisorComment: 'دیسپلین برق تابلوها با نقشه مکانیکی هم‌پوشانی دارد. تایید می‌شود.',
    supervisorApprovedAt: '2026-05-23 12:00',
    supervisorName: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)',
    managerComment: 'تایید نهایی مستندات تابلوها سد برای رئیس ارسال می‌گردد.',
    managerApprovedAt: '2026-05-23 14:15',
    managerName: 'خانم مهندس سلیمی (مدیر کنترل اسناد (Dcc))',
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_president'
  },
  {
    id: 'dcc_sub_10',
    templateId: 'dcc_codification',
    templateTitle: 'فرم درخواست صدور کدهای مستندسازی و بازنگری نقشه‌ها',
    unit: 'کنترل اسناد (Dcc)',
    staffId: '106',
    staffName: 'زهرا هاشمی',
    staffCode: '1006',
    createdAt: '2026-05-22 13:00',
    fieldsData: {
      drawing_title: 'دیالوگ فلو چارت کلی دستور کار کنترل پروژه نیروگاه',
      revision_no: 'Rev. 02',
      change_nature: 'مجرای ترخیص متون اسناد در کمیته برنامه‌ریزی جامع و هماهنگی با تیم مستندسازی کدهای ایزو.'
    },
    attachment: null,
    supervisorComment: 'چارچوب گردش نقشه تایید است.',
    supervisorApprovedAt: '2026-05-22 15:30',
    supervisorName: 'آقای کاظمی (سرپرست کنترل اسناد Dcc)',
    managerComment: 'آفرین به همکاران کنترل اسناد. با این فلوچارت ریسک تأخیر بازبینی بسیار کاهش یافت.',
    managerApprovedAt: '2026-05-22 17:00',
    managerName: 'خانم مهندس سلیمی (مدیر کنترل اسناد (Dcc))',
    presidentComment: 'فلوچارت فوق به عنوان سند رویه‌ای درون‌گروهی مصوب ابلاغ می‌گردد.',
    presidentApprovedAt: '2026-05-23 09:30',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  }
];
