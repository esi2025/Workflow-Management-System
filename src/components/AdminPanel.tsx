import React, { useState } from 'react';
import { User, FormTemplate, FormField } from '../types';
import { Users, FileSpreadsheet, Plus, Trash2, Key, HelpCircle, Check, ListFilter, AlertCircle, Shield, FolderKanban } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  templates: FormTemplate[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onAddTemplate: (template: FormTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  departments: string[];
  onAddDepartment: (name: string) => void;
  onDeleteDepartment: (name: string) => void;
  projects: string[];
  onAddProject: (name: string) => void;
  onDeleteProject: (name: string) => void;
}

export default function AdminPanel({
  users,
  templates,
  onAddUser,
  onDeleteUser,
  onAddTemplate,
  onDeleteTemplate,
  departments,
  onAddDepartment,
  onDeleteDepartment,
  projects,
  onAddProject,
  onDeleteProject
}: AdminPanelProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'templates' | 'users' | 'departments' | 'projects' | 'excel-guide'>('templates');
  
  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserCode, setNewUserCode] = useState('');
  const [newUserRole, setNewUserRole] = useState<'staff' | 'supervisor' | 'manager' | 'president'>('staff');
  const [newUserUnit, setNewUserUnit] = useState(departments[0] || 'فنی و مهندسی');
  const [newUserPassword, setNewUserPassword] = useState('123456');

  // New Template Form State
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateUnit, setNewTemplateUnit] = useState(departments[0] || 'فنی و مهندسی');
  const [newFields, setNewFields] = useState<FormField[]>([
    { id: 'field_1', label: 'شرح اصلی عیب یا پروژه', type: 'text', required: true }
  ]);

  // New Department State
  const [newDepartmentName, setNewDepartmentName] = useState('');

  // New Project State
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newDepartmentName.trim();
    if (!trimmed) return;
    if (departments.includes(trimmed)) {
      alert('این دپارتمان قبلاً ثبت شده است!');
      return;
    }
    onAddDepartment(trimmed);
    setNewDepartmentName('');
    alert(`دپارتمان "${trimmed}" با موفقیت ثبت شد.`);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newProjectName.trim();
    if (!trimmed) return;
    if (projects.includes(trimmed)) {
      alert('این پروژه قبلاً در سامانه تعریف شده است!');
      return;
    }
    onAddProject(trimmed);
    setNewProjectName('');
    alert(`پروژه جدید "${trimmed}" با موفقیت تعریف شد.`);
  };
  
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
        unit: 'واحد حسابداری و مالی',
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
    <div id="admin-panel-root" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm" dir="rtl">
      {/* Header (No counts displayed for confidentiality) */}
      <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">پنل تخصصی مدیریت سیستم (Admin)</h1>
            <p className="text-xs text-slate-400">طراحی فرم‌های سازمانی، تعریف پروژه‌ها، تخصیص کدهای پرسنلی و مدیریت سطوح دسترسی</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-slate-800 text-slate-300 text-[10px] px-3 py-1 rounded-full border border-slate-700 font-sans font-bold">نسخه فعال ۲.۴</span>
          <span className="bg-rose-500/20 text-rose-300 text-[10px] px-3 py-1 rounded-full border border-rose-500/30 font-sans font-bold">اتصال امن SSL</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'templates'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>طراحی فرم‌ها</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>تعریف پرسنل و دسترسی‌ها</span>
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'departments'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>مدیریت دپارتمان‌ها</span>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'projects'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>مدیریت پروژه‌ها</span>
        </button>
        <button
          onClick={() => setActiveTab('excel-guide')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
            activeTab === 'excel-guide'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>راهنمای ساختار اکسل</span>
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                در این بخش می‌توانید فرم‌های اداری را دگرگون یا یک قالب کاملا جدید طراحی کنید. هم پرسنل عادی دپارتمان مربوطه و هم سرپرستان از قالب فرم فعال برای گزارش استفاده خواهند کرد.
              </p>
            </div>

            {/* Template Creator Customization Form */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                <span className="p-1 bg-rose-500/10 rounded-md text-rose-500">+</span>
                طراحی فوری قالب فرم دلخواه سازمان
              </h3>

              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">عنوان دقیق قالب فرم</label>
                    <input
                      type="text"
                      placeholder="مثال: گزارش کنترل متریال انبار"
                      value={newTemplateTitle}
                      onChange={(e) => setNewTemplateTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">واحد / دپارتمان مرجع فرم</label>
                    <select
                      value={newTemplateUnit}
                      onChange={(e) => setNewTemplateUnit(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none text-slate-900 dark:text-slate-100"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">طراحی فیلدهای داده‌گیری فرم:</span>
                    <button
                      type="button"
                      onClick={addFieldToCreator}
                      className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      + افزودن فیلد خالی جدید
                    </button>
                  </div>

                  {newFields.map((field, idx) => (
                    <div key={field.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-3 shadow-xs">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                        <div className="md:col-span-5">
                          <input
                            type="text"
                            placeholder="نام یا سوال فیلد (مثال: میزان هزینه تقریبی)"
                            value={field.label}
                            onChange={(e) => updateFieldInCreator(field.id, { label: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-1.5 text-xs focus:outline-none"
                            required
                          />
                        </div>

                        <div className="md:col-span-3">
                          <select
                            value={field.type}
                            onChange={(e) => updateFieldInCreator(field.id, { type: e.target.value as any, options: e.target.value === 'dropdown' ? [] : undefined })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-1.5 text-xs focus:outline-none"
                          >
                            <option value="text">کادر متنی</option>
                            <option value="number">عدد صحیح</option>
                            <option value="dropdown">منوی کشویی</option>
                            <option value="textarea">توضیح تفصیلی</option>
                            <option value="checkbox">دکمه تیک دار</option>
                          </select>
                        </div>

                        <div className="md:col-span-2 text-center">
                          <label className="flex items-center justify-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateFieldInCreator(field.id, { required: e.target.checked })}
                              className="w-3.5 h-3.5"
                            />
                            <span className="text-[10px] text-slate-500">مجبور</span>
                          </label>
                        </div>

                        <div className="md:col-span-2 text-left">
                          <button
                            type="button"
                            onClick={() => removeFieldFromCreator(field.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 text-xs cursor-pointer font-bold"
                          >
                            حذف فیلد
                          </button>
                        </div>

                        {field.type === 'dropdown' && (
                          <div className="md:col-span-12 mt-1">
                            <input
                              type="text"
                              placeholder="گزینه‌ها را با کامای فارسی از هم جدا کنید - مثال: عالی، خوب، ضعیف"
                              onChange={(e) => updateFieldInCreator(field.id, { options: e.target.value.split('،').map(v => v.trim()) })}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-[10px] focus:outline-none"
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
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    ثبت نهایی و انتشار قالب فرم در کارتابل پرسنل
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Form templates list */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="inline-block p-1 bg-indigo-150 rounded text-indigo-700">≣</span>
                کتابخانه فرم‌های فعال شبکه ({templates.length} فرم)
              </h3>

              <div className="space-y-3">
                {templates.map(tmpl => (
                  <div key={tmpl.id} className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs relative hover:border-slate-350 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tmpl.unit}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('آیا از حذف این فرم از پورتال مطمئن هستید؟ پرسنل دیگر قادر به تکمیل نمونه جدید نخواهند بود.')) {
                            onDeleteTemplate(tmpl.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="حذف فرم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">{tmpl.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">تاریخ ساخت: {tmpl.createdAt}</span>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-semibold text-slate-500 mb-1.5">فیلدهای کارشناسی قالب:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tmpl.fields.map(f => (
                          <span key={f.id} className="text-[9px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
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
            <form onSubmit={handleCreateUser} className="lg:col-span-4 bg-slate-50 dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800 h-fit space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                <Key className="w-4 h-4 text-rose-500" />
                تعریف یوزر جدید در شبکه سازمان
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">نام کامل کارمند / پرسنل</label>
                <input
                  type="text"
                  placeholder="مثال: مهندس مهران طاهری"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">کد اختصاصی ورود (کد پرسنلی)</label>
                <input
                  type="text"
                  placeholder="مثال: 1045"
                  value={newUserCode}
                  onChange={(e) => setNewUserCode(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 text-slate-950 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">سطح نقش و تاییدات سازمانی</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
                >
                  <option value="staff">کارشناس واحد (تکمیل کننده)</option>
                  <option value="supervisor">سرپرست واحد (تایید اول و یادداشت)</option>
                  <option value="manager">مدیر کل دپارتمان (تایید دوم)</option>
                  <option value="president">رئیس کل شرکت (تایید نهایی و مهر)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">انتخاب واحد یا دپارتمان مربوطه</label>
                <select
                  value={newUserUnit}
                  onChange={(e) => setNewUserUnit(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="عمومی">عمومی سازمان</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">رمز عبور اختصاصی اولیه</label>
                <input
                  type="text"
                  placeholder="پیش فرض: 123456"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none text-slate-950 dark:text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg p-2 text-xs transition-colors cursor-pointer"
              >
                ایجاد اکانت و پرسنل جدید
              </button>
            </form>

            {/* Live Users Table */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>کاربران تعریف شده در پورتال اداری ({users.length} یوزر)</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">پرتال نظارت و کنترل سطوح امنیتی کاربری و کلمه‌های عبور</span>
              </h3>

              <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-right text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800/80">
                    <tr>
                      <th className="p-3">نام و مشخصات کارمند</th>
                      <th className="p-3">کد اختصاصی ورود</th>
                      <th className="p-3">واحد اداری</th>
                      <th className="p-3">سطح دسترسی</th>
                      <th className="p-3">رمز عبور</th>
                      <th className="p-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{u.name}</td>
                        <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-400">{u.code}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{u.unit}</td>
                        <td className="p-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                            u.role === 'president' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                            u.role === 'manager' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            u.role === 'supervisor' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {u.role === 'admin' ? 'مدیر سیستم' :
                             u.role === 'president' ? 'رئیس محترم شرکت' :
                             u.role === 'manager' ? 'مدیر دپارتمان' :
                             u.role === 'supervisor' ? 'سرپرست واحد' : 'کارشناس واحد'}
                          </span>
                        </td>
                        <td className="p-3">
                          <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px] font-mono">{u.passwordHint}</code>
                        </td>
                        <td className="p-3 text-left">
                          {u.code === 'admin' || u.code === '9001' ? (
                            <span className="text-[9px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">محافظت شده</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`آیا از حذف پرسنل "${u.name}" و ابطال دسترسی‌های ورود وی مطمئن هستید؟`)) {
                                  onDeleteUser(u.id);
                                  alert('پرسنل فرضی با موفقیت از سیستم اداری حذف شد.');
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-955/20 px-2 py-0.5 rounded transition-all text-[10px] cursor-pointer"
                            >
                              ابطال اکانت
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB (Requested feature) */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-sans">
                <FolderKanban className="w-4 h-4 text-rose-500" />
                تعریف و پیکربندی پروژه جدید سازمان
              </h3>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    نام کامل پروژه / کارگاه فعال
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: نیروگاه چرخه ترکیبی برق زاهدان"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500 text-slate-950 dark:text-slate-100 font-sans font-semibold"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg p-2.5 text-xs transition-colors cursor-pointer"
                >
                  افزودن و ثبت آنلاین پروژه
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                پروژه‌های در حال اجرا و ثبت شده در پایگاه اطلاعات ({projects.length} پروژه فعال)
              </h3>

              <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-right text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800/80">
                    <tr>
                      <th className="p-3">عنوان پروژه فعال</th>
                      <th className="p-3">ضریب ایمنی</th>
                      <th className="p-3 text-left">عملیات حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-805/80">
                    {projects.map(proj => (
                      <tr key={proj} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {proj}
                        </td>
                        <td className="p-3 text-slate-400 font-sans font-bold text-[10px]">سطح بالا - SSL</td>
                        <td className="p-3 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`آیا مطمئن هستید که می‌خواهید پروژه "${proj}" را حذف کنید؟`)) {
                                onDeleteProject(proj);
                                alert('پروژه با موفقیت از سیستم مکتوب حذف شد.');
                              }
                            }}
                            className="text-[10px] text-rose-500 hover:underline cursor-pointer px-2 py-0.5"
                          >
                            حذف پروژه
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Add New Department Form */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5 font-sans">
                  <span className="p-1 bg-rose-500/10 rounded text-rose-500">
                    <Plus className="w-4 h-4" />
                  </span>
                  افزودن دپارتمان جدید سازمانی
                </h3>
                <form onSubmit={handleCreateDepartment} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      نام دقیق دپارتمان / واحد اداری
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: امور قراردادها، فنی و مهندسی"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100 font-sans"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg p-2.5 text-xs transition-colors cursor-pointer"
                  >
                    ثبت دپارتمان تازه در سامانه
                  </button>
                </form>
              </div>

              {/* Registered Departments List (Counts removed for confidentiality) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-150">
                    دپارتمان‌های ثبت شده در شبکه مرکزی ({departments.length})
                  </h3>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    دپارتمان‌های پیش‌فرض قابل حذف نیستند.
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-xs text-right text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-850 text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">نام دپارتمان / واحد</th>
                        <th className="p-3">وضعیت ارتباطی</th>
                        <th className="p-3">شمار فرم سازها</th>
                        <th className="p-3 text-left">عملیات حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {departments.map(dept => {
                        const templateCount = templates.filter(t => t.unit === dept).length;
                        const isProtected = ['فنی و مهندسی', 'امور قراردادها', 'کنترل اسناد (Dcc)'].includes(dept);

                        return (
                          <tr key={dept} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                            <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                              {dept}
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full animate-pulse">
                                ● متصل و سلسله مراتب فعال
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{templateCount} قالب فرم فعال</td>
                            <td className="p-3 text-left">
                              {isProtected ? (
                                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                  سیستمی و حفاظت شده
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteDepartment(dept);
                                    alert(`دپارتمان "${dept}" با موفقیت حذف شد.`);
                                  }}
                                  className="text-[10px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/10 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  حذف دپارتمان
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'excel-guide' && (
          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-sans">
              <span className="p-1 bg-emerald-100 rounded text-emerald-700">✓</span>
              راهنمای قالب‌بندی فایل اکسل برای ادمین سیستم
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              برای ساختن اتوماتیک فرم‌ها با آپلود اکسل، ادمین باید فایل اکسل را به گونه‌ای طراحی کند که هر ردیف آن نشانگر یک فیلد یا سوال در فرم نهایی باشد. سیستم به صورت خودکار ستون‌های زیر را در اولین شیت (Sheet) می‌خواند:
            </p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 overflow-x-auto rounded-xl">
              <table className="w-full text-xs text-right text-slate-700 dark:text-slate-300 min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-bold">
                    <th className="p-2">ستون A (Label)</th>
                    <th className="p-2">ستون B (Type)</th>
                    <th className="p-2">ستون C (Required)</th>
                    <th className="p-2">ستون D (Options)</th>
                    <th className="p-2">توضیحات ستون</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-2 font-semibold">مبلغ درخواستی تنخواه</td>
                    <td className="p-2 font-mono text-indigo-500">number</td>
                    <td className="p-2">بله</td>
                    <td className="p-2 text-slate-400">خالی</td>
                    <td className="p-2 text-[11px] text-slate-500">فیلد دریافت عدد وارد شده در کارتابل مالی</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">توضیحات ضرورت مخارج</td>
                    <td className="p-2 font-mono text-indigo-500">textarea</td>
                    <td className="p-2">بله</td>
                    <td className="p-2 text-slate-400">خالی</td>
                    <td className="p-2 text-[11px] text-slate-500">فیلد متن بزرگ چند خطی جهت توضیحات کامل علت هزینه کرد</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">نوع مرخصی</td>
                    <td className="p-2 font-mono text-indigo-500">dropdown</td>
                    <td className="p-2">بله</td>
                    <td className="p-2 font-semibold">روزانه، ساعتی، استعلاجی</td>
                    <td className="p-2 text-[11px] text-slate-500">منوی کشویی دو یا چند گزینه ای - گزینه‌ها با کاما جدا می‌شوند</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
