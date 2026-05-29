import { User, FormTemplate, FormSubmission } from './types';

export const INITIAL_USERS: User[] = [
  // Admin
  { id: '1', code: 'admin', name: 'مهندس اکبری (مدیر سیستم والکترونیک)', role: 'admin', unit: 'عمومی', passwordHint: 'admin123' },
  
  // President/CEO
  { id: '2', code: '9001', name: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)', role: 'president', unit: 'عمومی', passwordHint: 'president9001' },
  
  // Managers (10 managers target - we specify keys)
  { id: '10', code: '3001', name: 'دکتر علوی (مدیر ارشد مهندسی و فنی)', role: 'manager', unit: 'واحد فنی و مهندسی', passwordHint: '123456' },
  { id: '11', code: '3002', name: 'خانم مهندس سلیمی (مدیر واحد منابع انسانی)', role: 'manager', unit: 'واحد منابع انسانی', passwordHint: '123456' },
  { id: '12', code: '3003', name: 'جناب آقای شادمان (مدیر امور مالی و حسابداری)', role: 'manager', unit: 'واحد حسابداری و مالی', passwordHint: '123456' },
  { id: '13', code: '3004', name: 'خانم دکتر خسروی (مدیر بازاریابی و فروش)', role: 'manager', unit: 'واحد فروش و بازاریابی', passwordHint: '123456' },
  
  // Supervisors (20 supervisors target - we specify keys)
  { id: '20', code: '2001', name: 'مهندس رضایی (سرپرست کارگاه مرکزی)', role: 'supervisor', unit: 'واحد فنی و مهندسی', passwordHint: '123456' },
  { id: '21', code: '2002', name: 'آقای کاظمی (سرپرست رفاه کارمندان)', role: 'supervisor', unit: 'واحد منابع انسانی', passwordHint: '123456' },
  { id: '22', code: '2003', name: 'سرکار خانم کمالی (سرپرست حسابداری عمومی)', role: 'supervisor', unit: 'واحد حسابداری و مالی', passwordHint: '123456' },
  { id: '23', code: '2004', name: 'آقای عباسی (سرپرست بازاریابی داخلی)', role: 'supervisor', unit: 'واحد فروش و بازاریابی', passwordHint: '123456' },
  
  // Experts / Staff (200 employees targets)
  { id: '101', code: '1001', name: 'علی حسینی (کارشناس ارشد شبکه)', role: 'staff', unit: 'واحد فنی و مهندسی', passwordHint: '123456' },
  { id: '102', code: '1002', name: 'نرگس محمدی (کارشناس پشتیبان فنی)', role: 'staff', unit: 'واحد فنی و مهندسی', passwordHint: '123456' },
  { id: '103', code: '1003', name: 'رضا امینی (کارشناس پذیرش پرسنل)', role: 'staff', unit: 'واحد منابع انسانی', passwordHint: '123456' },
  { id: '104', code: '1004', name: 'مریم کریمی (حسابدار ارشد حقوق و دستمزد)', role: 'staff', unit: 'واحد حسابداری و مالی', passwordHint: '123456' },
  { id: '105', code: '1005', name: 'پیمان حسنی (کارشناس بازاریابی محتوا)', role: 'staff', unit: 'واحد فروش و بازاریابی', passwordHint: '123456' },
  { id: '106', code: '1006', name: 'امیر قاسمی (اپراتور نصب تجهیزات)', role: 'staff', unit: 'واحد فنی و مهندسی', passwordHint: '123456' }
];

export const INITIAL_TEMPLATES: FormTemplate[] = [
  {
    id: 'tech_daily',
    title: 'فرم گزارش روزانه کارکرد پروژه های فنی',
    unit: 'واحد فنی و مهندسی',
    createdAt: '2026-05-25',
    fields: [
      { id: 'proj_code', label: 'کد پروژه یا نام کارگاه فعال', type: 'text', required: true },
      { id: 'hours_spent', label: 'مدت زمان کارکرد پرسنل بر حسب ساعت', type: 'number', required: true },
      { id: 'summary', label: 'شرح اقدامات و کارهای انجام شده امروز', type: 'textarea', required: true },
      { id: 'materials_used', label: 'ابزارآلات و قطعات مصرفی یا مفقودی', type: 'text', required: false },
      { id: 'safety_status', label: 'تأیید رعایت کامل پروتکل‌‌های ایمنی و ایمن نگه داشتن کارگاه', type: 'checkbox', required: true }
    ]
  },
  {
    id: 'finance_advance',
    title: 'فرم درخواست پرداخت تنخواه و علی‌الحساب کارپردازی',
    unit: 'واحد حسابداری و مالی',
    createdAt: '2026-05-26',
    fields: [
      { id: 'beneficiary', label: 'نام کامل ذینفع نهایی یا شخص فاکتور دهنده', type: 'text', required: true },
      { id: 'amount', label: 'مبلغ علی‌الحساب ریالی درخواستی', type: 'number', required: true },
      { id: 'exp_type', label: 'دسته بندی نوع هزینه کرد تنخواه', type: 'dropdown', required: true, options: ['خرید اقلام مصرفی اداری', 'هزینه حمل و نقل و باربری', 'تعمیرات فوری ماشین‌آلات صنعتی', 'هزینه‌های عمومی پذیرایی و تشریفات'] },
      { id: 'description', label: 'علت و ضرورت پرداخت فوری این هزینه تنخواه', type: 'textarea', required: true }
    ]
  },
  {
    id: 'hr_leave',
    title: 'فرم درخواست مرخصی ماهانه کارمندان',
    unit: 'واحد منابع انسانی',
    createdAt: '2026-05-27',
    fields: [
      { id: 'leave_type', label: 'نوع مرخصی درخواستی', type: 'dropdown', required: true, options: ['مرخصی استحقاقی روزانه', 'مرخصی استعلاجی با گواهی پزشکی', 'مرخصی بدون حقوق اضطراری', 'مرخصی ساعتی اداری'] },
      { id: 'days', label: 'تعداد روزهای درخواستی مرخصی', type: 'number', required: true },
      { id: 'start_date', label: 'تاریخ دقیق شروع مرخصی به خورشیدی (مثال: ۱۴۰۵/۰۳/۱۰)', type: 'text', required: true },
      { id: 'substitute_code', label: 'کد پرسنلی یا نام همکار معین (جانشین در دوره مرخصی)', type: 'text', required: true }
    ]
  },
  {
    id: 'sales_lead',
    title: 'فرم گزارش بازاریابی و ثبت مشتریان بالقوه سد راهبردی',
    unit: 'واحد فروش و بازاریابی',
    createdAt: '2026-05-28',
    fields: [
      { id: 'client_name', label: 'نام کامل مشتری حقیقی یا نماینده حقوقی سازمان', type: 'text', required: true },
      { id: 'est_revenue', label: 'ارزش مالی تقریبی معامله احتمالی (ریال)', type: 'number', required: true },
      { id: 'priority', label: 'درجه اهمیت و شانس جذب مشتری', type: 'dropdown', required: true, options: ['بحرانی و گرم (آلویت الف)', 'عادی و بلند مدت (اولویت ب)', 'آزمایشی و سرد (اولویت ج)'] },
      { id: 'next_actions', label: 'اقدامات بعدی مورد نیاز و شرح تماس‌های اولیه', type: 'textarea', required: true }
    ]
  }
];

export const INITIAL_SUBMISSIONS: FormSubmission[] = [
  // Draft
  {
    id: 'sub_1',
    templateId: 'tech_daily',
    templateTitle: 'فرم گزارش روزانه کارکرد پروژه های فنی',
    unit: 'واحد فنی و مهندسی',
    staffId: '101',
    staffName: 'علی حسینی',
    staffCode: '1001',
    createdAt: '2026-05-28 10:30',
    fieldsData: {
      proj_code: 'کارگاه فونداسیون شعبه دوم کرج',
      hours_spent: 8,
      summary: 'انجام عملیات کابل‌کشی فرعی شبکه داخلی و راه‌اندازی سوییچ لایه ۲. تست سرعت پکت ها و برقراری روتینگ مناسب.',
      materials_used: '۳۰ متر کابل لگراند Cat6 - ۵ عدد کیستون کابل شبکه',
      safety_status: true
    },
    attachment: { name: 'report_diagram_v1.png', size: '1.2 MB', type: 'image/png' },
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'draft'
  },
  
  // Sent to Supervisor
  {
    id: 'sub_2',
    templateId: 'finance_advance',
    templateTitle: 'فرم درخواست پرداخت تنخواه و علی‌الحساب کارپردازی',
    unit: 'واحد حسابداری و مالی',
    staffId: '104',
    staffName: 'مریم کریمی',
    staffCode: '1004',
    createdAt: '2026-05-28 08:45',
    fieldsData: {
      beneficiary: 'سخت افزار سپهر تهران',
      amount: 45000000,
      exp_type: 'تعمیرات فوری ماشین‌آلات صنعتی',
      description: 'خرید قطعات هارد دیسک جایگزین برای بک آپ سرور مرکزی مالی به دلیل وجود ریسک از دست رفتن داده های تراکنش های آخر ماه جاری مابین شعب.'
    },
    attachment: { name: 'pro_forma_invoice_882.pdf', size: '420 KB', type: 'application/pdf' },
    supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_supervisor'
  },
  
  // Sent to Manager
  {
    id: 'sub_3',
    templateId: 'hr_leave',
    templateTitle: 'فرم درخواست مرخصی ماهانه کارمندان',
    unit: 'واحد منابع انسانی',
    staffId: '103',
    staffName: 'رضا امینی',
    staffCode: '1003',
    createdAt: '2026-05-27 12:15',
    fieldsData: {
      leave_type: 'مرخصی استحقاقی روزانه',
      days: 3,
      start_date: '۱۴۰۵/۰۳/۱۵',
      substitute_code: 'زهرا رضایی (کد پرسنلی ۱۰۸)'
    },
    attachment: null,
    // Approved by supervisor
    supervisorComment: 'با مرخصی ۳ روزه ایشان با توجه به هماهنگی با خانم زهرا رضایی به عنوان همکار جانشین موافقت می‌گردد. کارهای معوقه قبلاً تعیین شده‌اند.',
    supervisorApprovedAt: '2026-05-27 15:40',
    supervisorName: 'آقای کاظمی (سرپرست رفاه کارمندان)',
    managerComment: null, managerApprovedAt: null, managerName: null,
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_manager'
  },
  
  // Sent to President
  {
    id: 'sub_4',
    templateId: 'sales_lead',
    templateTitle: 'فرم گزارش بازاریابی و ثبت مشتریان بالقوه سد راهبردی',
    unit: 'واحد فروش و بازاریابی',
    staffId: '105',
    staffName: 'پیمان حسنی',
    staffCode: '1005',
    createdAt: '2026-05-26 14:00',
    fieldsData: {
      client_name: 'شرکت پتروشیمی زاگرس (واحد توسعه و نوسازی)',
      est_revenue: 1250000000,
      priority: 'بحرانی و گرم (آلویت الف)',
      next_actions: 'مذاکرات اولیه با مدیریت خرید نهایی انجام شده است. نیاز به تصفیه مقدماتی مدارک ارزیابی کیفی شرکت برای ثبت نام در پورتال معاملات داریم.'
    },
    attachment: { name: 'petro_zagros_criteria.pdf', size: '2.1 MB', type: 'application/pdf' },
    // Approved by supervisor
    supervisorComment: 'مورد تایید است. پتروشیمی زاگرس مشتری ایده آلی است و پیگیری جدی آقای حسنی نشان دهنده آمادگی کامل پرسنل می باشد.',
    supervisorApprovedAt: '2026-05-26 16:30',
    supervisorName: 'آقای عباسی (سرپرست بازاریابی داخلی)',
    // Approved by manager
    managerComment: 'آفرین به همکاران. با توجه به اهمیت استراتژیک این تفاهم‌نامه خرید پتروشیمی، تأیید کرده و جهت دستور نهایی اقدام مقتضی و تخفیفات احتمالی خدمت ریاست محترم ارسال می‌گردد.',
    managerApprovedAt: '2026-05-27 09:12',
    managerName: 'خانم دکتر خسروی (مدیر بازاریابی و فروش)',
    presidentComment: null, presidentApprovedAt: null, presidentName: null,
    status: 'sent_to_president'
  },
  
  // Approved & Archived
  {
    id: 'sub_5',
    templateId: 'tech_daily',
    templateTitle: 'فرم گزارش روزانه کارکرد پروژه های فنی',
    unit: 'واحد فنی و مهندسی',
    staffId: '102',
    staffName: 'نرگس محمدی',
    staffCode: '1002',
    createdAt: '2026-05-25 11:00',
    fieldsData: {
      proj_code: 'کارگاه سرور روم مرکزی دفتر مرکزی',
      hours_spent: 6,
      summary: 'انجام بازآرایی سرورهای مانیتورینگ لینوکس Zabbix و ارتقای مخازن. رفع مشکلات مربوط به گزارش‌دهی خودکار دیسک سرورهای شعبه هرمزگان.',
      materials_used: 'هیچ قطعه ای مصرف نشد.',
      safety_status: true
    },
    attachment: null,
    // Approved by supervisor
    supervisorComment: 'با تشکر از خانم محمدی بابت رفع عیب فوری سرور مانیتورینگ سیستم که از دیروز قطع شده بود. کار رضایت بخش گزارش شد.',
    supervisorApprovedAt: '2026-05-25 14:30',
    supervisorName: 'مهندس رضایی (سرپرست کارگاه)',
    // Approved by manager
    managerComment: 'مورد ارزیابی قرار گرفت، عملکرد همکار فنی عالی و بموقع بود.',
    managerApprovedAt: '2026-05-25 16:00',
    managerName: 'دکتر علوی (مدیر ارشد مهندسی و فنی)',
    // Approved by President
    presidentComment: 'بسیار از عیب یابی سریع و مسئولیت پذیری سرکار خانم محمدی تقدیر می کنم. پاداش فصلی برای ایشان منظور گردد.',
    presidentApprovedAt: '2026-05-25 17:35',
    presidentName: 'جناب آقای مهندس رستمی (ریاست محترم شرکت)',
    status: 'approved_by_president'
  }
];
