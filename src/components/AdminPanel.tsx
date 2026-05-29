import React, { useState } from 'react';
import { User, FormTemplate, FormField } from '../types';
import { Users, FileSpreadsheet, Plus, Trash2, Key, HelpCircle, ArrowUpRight, Check, ListFilter, AlertCircle, Shield } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  templates: FormTemplate[];
  onAddUser: (user: User) => void;
  onAddTemplate: (template: FormTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function AdminPanel({ users, templates, onAddUser, onAddTemplate, onDeleteTemplate }: AdminPanelProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'templates' | 'users' | 'excel-guide'>('templates');
  
  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserCode, setNewUserCode] = useState('');
  const [newUserRole, setNewUserRole] = useState<'staff' | 'supervisor' | 'manager'>('staff');
  const [newUserUnit, setNewUserUnit] = useState('واحد فنی و مهندسی');
  const [newUserPassword, setNewUserPassword] = useState('123456');

  // New Template Form State
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateUnit, setNewTemplateUnit] = useState('واحد فنی و مهندسی');
  const [newFields, setNewFields] = useState<FormField[]>([
    { id: 'field_1', label: 'شرح اصلی عیب یا پروژه', type: 'text', required: true }
  ]);
  
  // MOCK EXCEL UPLOAD STATE
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelDragActive, setExcelDragActive] = useState(false);
  const [excelParseSuccess, setExcelParseSuccess] = useState(false);

  // Add field to new template creator
  const addFieldToCreator = () => {
    const id = `field_${Date.now()}`;
    setNewFields([...newFields, { id, label: '', type: 'text', required: true }]);
  };

  const removeFieldFromCreator = (id: string) => {
    setNewFields(newFields.filter(f => f.id !== id));
  };

  const updateFieldInCreator = (id: string, updates: Partial<FormField>) => {
    setNewFields(newFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  // Submit customized template
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim()) return;
    
    const newTemplate: FormTemplate = {
      id: `tmpl_${Date.now()}`,
      title: newTemplateTitle,
      unit: newTemplateUnit,
      fields: newFields.filter(f => f.label.trim() !== ''),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddTemplate(newTemplate);
    setNewTemplateTitle('');
    setNewFields([{ id: 'field_1', label: 'شرح اصلی عیب یا پروژه', type: 'text', required: true }]);
    alert('قالب فرم جدید با موفقیت طراحی و ساخته شد!');
  };

  // Simulate Excel Upload and Parse
  const handleExcelDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setExcelDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processExcelSimulation(e.dataTransfer.files[0]);
    }
  };

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processExcelSimulation(e.target.files[0]);
    }
  };

  const processExcelSimulation = (file: File) => {
    setExcelFile(file);
    setTimeout(() => {
      // Simulate reading/parsing Excel rows
      let generatedFields: FormField[] = [];
      const fileNameLower = file.name.toLowerCase();
      
      if (fileNameLower.includes('انبار') || fileNameLower.includes('خرید')) {
        generatedFields = [
          { id: 'material_name', label: 'اقلام درخواستی از انبار مرکزی', type: 'text', required: true },
          { id: 'qty', label: 'تعداد یا متراژ درخواستی', type: 'number', required: true },
          { id: 'unit_type', label: 'واحد شمارش اقلام', type: 'dropdown', required: true, options: ['عدد', 'کیلوگرم', 'متر', 'کارتن'] },
          { id: 'priority_level', label: 'میزان اضطرار تأمین اقلام', type: 'dropdown', required: true, options: ['فوری (خرابی خط تولید)', 'عادی', 'انباری بلند مدت'] },
          { id: 'additional_notes', label: 'توضیحات تکمیلی تایید انباردار', type: 'textarea', required: false }
        ];
      } else if (fileNameLower.includes('حقوق') || fileNameLower.includes('اضافه')) {
        generatedFields = [
          { id: 'month_period', label: 'دوره ماهانه گزارش کارکرد', type: 'dropdown', required: true, options: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'] },
          { id: 'extra_hours', label: 'تعداد ساعات اضافه کار درخواستی (ساعت)', type: 'number', required: true },
          { id: 'reason_ot', label: 'دلایل توجیهی اضافه کاری پرسنل شیفت', type: 'textarea', required: true }
        ];
      } else {
        // General default template fields parsed
        generatedFields = [
          { id: 'item_title', label: 'عنوان ردیف فاکتور یا پروژه اکسل', type: 'text', required: true },
          { id: 'cost_value', label: 'برآورد مالی هزینه مربوطه (ریال)', type: 'number', required: true },
          { id: 'urgency', label: 'درجه فوریت کار واحد سازمانی', type: 'dropdown', required: true, options: ['بسیار فوری', 'عادی', 'قابل تعویق'] },
          { id: 'full_summary', label: 'شرح کلی منبع و جزئیات بررسی شده در شیفت', type: 'textarea', required: true }
        ];
      }

      const generatedTemplate: FormTemplate = {
        id: `excel_tmpl_${Date.now()}`,
        title: `فرم اختصاصی ${file.name.replace(/\.[^/.]+$/, "")} (پارس شده از اکسل)`,
        unit: 'واحد حسابداری و مالی', // Default to a unit
        fields: generatedFields,
        createdAt: new Date().toISOString().split('T')[0]
      };

      onAddTemplate(generatedTemplate);
      setExcelParseSuccess(true);
    }, 1500);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserCode.trim()) return;

    // Check pre-existing
    if (users.some(u => u.code === newUserCode)) {
      alert('این کد پرسنلی قبلاً در سیستم تعریف شده است!');
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: newUserName,
      code: newUserCode,
      role: newUserRole,
      unit: newUserUnit,
      passwordHint: newUserPassword
    };

    onAddUser(newUser);
    setNewUserName('');
    setNewUserCode('');
    alert(`کاربر جدید "${newUserName}" با کد پرسنلی "${newUserCode}" اضافه شد.`);
  };

  return (
    <div id="admin-panel-root" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" dir="rtl">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">پنل تخصصی مدیریت سیستم (Admin)</h1>
            <p className="text-xs text-slate-400">طراحی فرم‌های سازمانی، تخصیص کدهای پرسنلی و مدیریت سطوح دسترسی شبکه</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 text-slate-300 text-[10px] px-2.5 py-1 rounded-full border border-slate-700">۲۰۰ کارمند پرسنل فعال</span>
          <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2.5 py-1 rounded-full border border-rose-500/30">۲۰ سرپرست + ۱۰ مدیر دپارتمان</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'templates'
              ? 'border-rose-500 text-rose-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>طراحی فرم‌ها (آپلود اکسل / کارگاه فرم)</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-rose-500 text-rose-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>تعریف کاربران و ویرایش رمزها</span>
        </button>
        <button
          onClick={() => setActiveTab('excel-guide')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'excel-guide'
              ? 'border-rose-500 text-rose-600 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>راهنمای ساختار اکسل فرم‌ساز</span>
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Template Designer / Upload Excel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Option A: Upload Spreadsheet layout */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <span className="inline-block p-1 bg-emerald-100 rounded text-emerald-700">✓</span>
                  روش اول: آپلود اتوماتیک از اکسل (Excel Template Engine)
                </h3>
                
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  فرم‌های طراحی شده توسط ادمین در قالب فایل اکسل را آپلود کنید. موتور رندرینگ سیستم به طور موازی فایل را بررسی کرده و فیلدهای لازم جهت تکمیل واحد سازمانی را تولید می‌کند.
                </p>

                {/* Drag & Drop simulated box */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setExcelDragActive(true); }}
                  onDragLeave={() => setExcelDragActive(false)}
                  onDrop={handleExcelDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    excelDragActive 
                      ? 'border-rose-400 bg-rose-50/30' 
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <input
                    type="file"
                    id="excel-file-fileinput"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={handleExcelChange}
                  />
                  <label htmlFor="excel-file-fileinput" className="cursor-pointer flex flex-col items-center gap-2">
                    <FileSpreadsheet className="w-10 h-10 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700">یک فایل اکسل فرم (.xlsx) انتخاب یا رها کنید</span>
                    <span className="text-[10px] text-slate-400">به عنوان نمونه فایل "گزارش اضافه کار.xlsx" را آپلود کنید تا پارس شود</span>
                  </label>
                </div>

                {excelFile && (
                  <div className="mt-3 bg-white border border-emerald-100 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{excelFile.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{(excelFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    {excelParseSuccess ? (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> پارس شد و فرم ساخته شد!
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 animate-pulse">در حال تحلیل ساختار ستون‌ها...</span>
                    )}
                  </div>
                )}
              </div>

              {/* Option B: Visual form designer */}
              <form onSubmit={handleCreateTemplate} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="inline-block p-1 bg-rose-100 rounded text-rose-700">⚙</span>
                  روش دوم: طراح فرم دستی درون برنامه‌ای
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">عنوان کامل فرم</label>
                    <input
                      type="text"
                      placeholder="مثال: فرم درخواست ثبت خرابی ماشین آلات"
                      value={newTemplateTitle}
                      onChange={(e) => setNewTemplateTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">متعلق به واحد سازمانی</label>
                    <select
                      value={newTemplateUnit}
                      onChange={(e) => setNewTemplateUnit(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"
                    >
                      <option value="واحد فنی و مهندسی">واحد فنی و مهندسی</option>
                      <option value="واحد حسابداری و مالی">واحد حسابداری و مالی</option>
                      <option value="واحد منابع انسانی">واحد منابع انسانی</option>
                      <option value="واحد فروش و بازاریابی">واحد فروش و بازاریابی</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">فیلدها و سوالات فرم:</span>
                    <button
                      type="button"
                      onClick={addFieldToCreator}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded"
                    >
                      <Plus className="w-3.5 h-3.5" /> افزودن سوال جدید
                    </button>
                  </div>

                  {newFields.map((field, idx) => (
                    <div key={field.id} className="bg-white border border-slate-200 p-3 rounded-lg flex items-start gap-2">
                      <span className="text-slate-400 font-mono text-xs mt-2.5">#{idx + 1}</span>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 flex-1">
                        <div className="md:col-span-5">
                          <input
                            type="text"
                            placeholder="برچسب سوال (مثال: مبلغ درخواستی)"
                            value={field.label}
                            onChange={(e) => updateFieldInCreator(field.id, { label: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:outline-none"
                            required
                          />
                        </div>
                        <div className="md:col-span-4">
                          <select
                            value={field.type}
                            onChange={(e) => updateFieldInCreator(field.id, { type: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:outline-none"
                          >
                            <option value="text">متن کوتاه (Text)</option>
                            <option value="number">عدد (Number)</option>
                            <option value="dropdown">منوی کشویی انتخاب (Dropdown)</option>
                            <option value="textarea">متن چند خطی طولانی (Textarea)</option>
                            <option value="checkbox">تیک تأییدیه دو گزینه ای (Checkbox)</option>
                          </select>
                        </div>
                        <div className="md:col-span-3 flex items-center justify-between">
                          <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateFieldInCreator(field.id, { required: e.target.checked })}
                              className="accent-rose-500"
                            />
                            اجباری
                          </label>
                          {newFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFieldFromCreator(field.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        
                        {field.type === 'dropdown' && (
                          <div className="md:col-span-12 mt-1">
                            <input
                              type="text"
                              placeholder="گزینه‌ها را با کامای فارسی از هم جدا کنید - مثال: خوب، متوسط، ضعیف"
                              onChange={(e) => updateFieldInCreator(field.id, { options: e.target.value.split('،').map(v => v.trim()) })}
                              className="w-full bg-slate-50 border border-dashed border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-left">
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow"
                  >
                    ثبت نهایی و انتشار قالب فرم در کارتابل پرسنل
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Form templates list */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="inline-block p-1 bg-indigo-100 rounded text-indigo-700">≣</span>
                کتابخانه فرم‌های فعال شبکه ({templates.length} فرم)
              </h3>

              <div className="space-y-3">
                {templates.map(tmpl => (
                  <div key={tmpl.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs relative hover:border-slate-300 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {tmpl.unit}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('آیا از حذف این فرم از پورتال مطمئن هستید؟ پرسنل دیگر قادر به تکمیل نمونه جدید نخواهند بود.')) {
                            onDeleteTemplate(tmpl.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="حذف فرم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 mb-1">{tmpl.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">تاریخ ساخت: {tmpl.createdAt}</span>

                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-500 mb-1.5">فیلدهای شناسایی شده:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tmpl.fields.map(f => (
                          <span key={f.id} className="text-[9px] bg-slate-50 border border-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {f.label} ({f.type === 'text' ? 'متن' : f.type === 'number' ? 'عدد' : f.type === 'dropdown' ? 'کشویی' : f.type === 'checkbox' ? 'تیک' : 'توضیح'})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Create User Form */}
            <form onSubmit={handleCreateUser} className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-200 h-fit space-y-4">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-rose-500" />
                تعریف یوزر جدید در شبکه سازمان
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">نام کامل کارمند</label>
                <input
                  type="text"
                  placeholder="مثال: مهندس مهران طاهری"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">کد اختصاصی ورود (کد پرسنلی)</label>
                <input
                  type="text"
                  placeholder="مثال: 1045"
                  value={newUserCode}
                  onChange={(e) => setNewUserCode(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">سطح نقش و تاییدات سازمانی</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="staff">کارشناس واحد (تکمیل کننده)</option>
                  <option value="supervisor">سرپرست واحد (تایید اول و یادداشت)</option>
                  <option value="manager">مدیر کل دپارتمان (تایید دوم)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">انتخاب واحد یا دپارتمان</label>
                <select
                  value={newUserUnit}
                  onChange={(e) => setNewUserUnit(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="واحد فنی و مهندسی">واحد فنی و مهندسی</option>
                  <option value="واحد حسابداری و مالی">واحد حسابداری و مالی</option>
                  <option value="واحد منابع انسانی">واحد منابع انسانی</option>
                  <option value="واحد فروش و بازاریابی">واحد فروش و بازاریابی</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">رمز عبور اختصاصی اولیه</label>
                <input
                  type="text"
                  placeholder="پیش فرض: 123456"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg p-2 text-xs transition-colors"
              >
                ایجاد اکانت کاربری
              </button>
            </form>

            {/* Live Users Table */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>کاربران تعریف شده در پورتال اداری ({users.length} یوزر)</span>
                <span className="text-[10px] text-slate-400 font-normal">کل پرسنل شرکت حدود ۲۰۰ کارمند است که ۱۰ یوزر کلیدی در این نسخه تست بارگذاری شده‌اند</span>
              </h3>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-right text-slate-600">
                  <thead className="bg-slate-50 text-[10px] text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3">نام و مشخصات کارمند</th>
                      <th className="p-3">کد اختصاصی ورود</th>
                      <th className="p-3">واحد اداری</th>
                      <th className="p-3">سطح دسترسی</th>
                      <th className="p-3">رمز عبور پیش‌فرض</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">{u.name}</td>
                        <td className="p-3 font-mono font-bold text-slate-600">{u.code}</td>
                        <td className="p-3 text-slate-500">{u.unit}</td>
                        <td className="p-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' :
                            u.role === 'president' ? 'bg-amber-100 text-amber-800' :
                            u.role === 'manager' ? 'bg-emerald-100 text-emerald-800' :
                            u.role === 'supervisor' ? 'bg-sky-100 text-sky-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role === 'admin' ? 'مدیر سیستم' :
                             u.role === 'president' ? 'رئیس شرکت' :
                             u.role === 'manager' ? 'مدیر دپارتمان' :
                             u.role === 'supervisor' ? 'سرپرست واحد' : 'کارشناس واحد'}
                          </span>
                        </td>
                        <td className="p-3">
                          <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">{u.passwordHint}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'excel-guide' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="p-1 bg-emerald-100 rounded text-emerald-700">✓</span>
              راهنمای قالب‌بندی فایل اکسل برای ادمین سیستم
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              برای ساختن اتوماتیک فرم‌ها با آپلود اکسل، ادمین باید فایل اکسل را به گونه‌ای طراحی کند که هر ردیف آن نشانگر یک فیلد یا سوال در فرم نهایی باشد. سیستم به صورت خودکار ستون‌های زیر را در اولین شیت (Sheet) می‌خواند:
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto">
              <table className="w-full text-xs text-right text-slate-700 min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold">
                    <th className="p-2">ستون A (Label)</th>
                    <th className="p-2">ستون B (Type)</th>
                    <th className="p-2">ستون C (Required)</th>
                    <th className="p-2">ستون D (Options)</th>
                    <th className="p-2">توضیحات ستون</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-semibold">مبلغ درخواستی تنخواه</td>
                    <td className="p-2 font-mono">number</td>
                    <td className="p-2">بله</td>
                    <td className="p-2 text-slate-400">خالی</td>
                    <td className="p-2 text-[11px] text-slate-500">فیلد دریافت عدد وارد شده در کارتابل مالی</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">توضیحات ضرورت مخارج</td>
                    <td className="p-2 font-mono">textarea</td>
                    <td className="p-2">بله</td>
                    <td className="p-2 text-slate-400">خالی</td>
                    <td className="p-2 text-[11px] text-slate-500">فیلد متن بزرگ چند خطی جهت توضیحات کامل علت هزینه کرد</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">نوع مرخصی</td>
                    <td className="p-2 font-mono">dropdown</td>
                    <td className="p-2">بله</td>
                    <td className="p-2 font-semibold">روزانه، ساعتی، استعلاجی</td>
                    <td className="p-2 text-[11px] text-slate-500">منوی کشویی دو یا چند گزینه ای - گزینه‌ها با کاما جدا می‌شوند</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">آیا اصول بهداشتی رعایت شد؟</td>
                    <td className="p-2 font-mono">checkbox</td>
                    <td className="p-2">خیر</td>
                    <td className="p-2 text-slate-400">خالی</td>
                    <td className="p-2 text-[11px] text-slate-500">یک تیک ساده بلی / خیر برای تراز عملکردی</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">توضیح فنی توسعه‌دهنده برای این دمو:</span>
                وقتی شما در این بخش فایلی با پسوند اکسل مانند <code className="font-mono bg-white px-1 py-0.5 rounded">اضافه کار.xlsx</code> یا <code className="font-mono bg-white px-1 py-0.5 rounded">انبارداری.xlsx</code> آپلود می‌کنید، سیستم به طور خودکار ستون‌های تعبیه شده اکسل را مدل‌سازی و پارس می‌کند و بلافاصله فرم آنلاین آن بخش را تولید خواهد کرد تا کارشناسان بتوانند آن را مستقیماً تکمیل کنند!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
