import React, { useState } from 'react';
import { User, FormTemplate, FormSubmission } from '../types';
import { FileText, Send, Paperclip, CheckCircle, Clock, AlertTriangle, ChevronRight, FileUp, Database, FileSpreadsheet } from 'lucide-react';

interface StaffFormSubmissionProps {
  currentUser: User;
  templates: FormTemplate[];
  submissions: FormSubmission[];
  onCreateSubmission: (submission: FormSubmission) => void;
  onDeleteSubmission: (id: string) => void;
}

export default function StaffFormSubmission({
  currentUser,
  templates,
  submissions,
  onCreateSubmission,
  onDeleteSubmission
}: StaffFormSubmissionProps) {
  // Filter templates for current staff unit
  const unitTemplates = templates.filter(t => t.unit === currentUser.unit || t.unit === 'عمومی');
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    unitTemplates.length > 0 ? unitTemplates[0] : null
  );

  // Form Field values
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [attachment, setAttachment] = useState<{ name: string; size: string; type: string } | null>(null);
  
  // Drag drop simulation for attachment
  const [dragActive, setDragActive] = useState(false);

  // Filter submissions by this staff member
  const mySubmissions = submissions.filter(s => s.staffId === currentUser.id);

  // Handle template switch
  const handleTemplateChange = (tmplId: string) => {
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) {
      setSelectedTemplate(tmpl);
      setFormValues({});
      setAttachment(null);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  // Simulate file upload
  const simulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachment({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type
      });
    }
  };

  // Submit draft/real form
  const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    // Check required fields
    if (!isDraft) {
      const missing = selectedTemplate.fields.filter(
        f => f.required && (formValues[f.id] === undefined || formValues[f.id] === '')
      );
      if (missing.length > 0) {
        alert(`لطفاً فیلد اجباری را تکمیل کنید: ${missing[0].label}`);
        return;
      }
    }

    const newSub: FormSubmission = {
      id: `sub_${Date.now()}`,
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      unit: currentUser.unit,
      staffId: currentUser.id,
      staffName: currentUser.name,
      staffCode: currentUser.code,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      fieldsData: formValues,
      attachment,
      supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
      managerComment: null, managerApprovedAt: null, managerName: null,
      presidentComment: null, presidentApprovedAt: null, presidentName: null,
      status: isDraft ? 'draft' : 'sent_to_supervisor'
    };

    onCreateSubmission(newSub);
    setFormValues({});
    setAttachment(null);
    alert(isDraft ? 'پیش‌نویس با موفقیت ذخیره شد.' : 'فرم با موفقیت ثبت و فورا به سرپرست واحد شما ارسال گردید.');
  };

  return (
    <div id="staff-submission-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      
      {/* Sidebar: Submissions history with status tracking */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-none">
          <Database className="w-4 h-4 text-slate-500" />
          <span>فرم‌های ثبت شده شما ({mySubmissions.length})</span>
        </h3>

        <div className="space-y-3">
          {mySubmissions.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">شما هنوز هیچ فرمی در سیستم ثبت نکرده‌اید.</p>
              <p className="text-[10px] text-slate-400 mt-1">از فرم روبرو استفاده کرده و فرم جدید ایجاد کنید.</p>
            </div>
          ) : (
            mySubmissions.map(sub => {
              // Status steps UI details
              const statuses = [
                { key: 'draft', label: 'پیش‌نویس', color: 'text-slate-400 bg-slate-100 border-slate-200' },
                { key: 'sent_to_supervisor', label: 'دست سرپرست', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                { key: 'sent_to_manager', label: 'دست مدیر بخش', color: 'text-amber-600 bg-amber-50 border-amber-200' },
                { key: 'sent_to_president', label: 'دست رئیس شرکت', color: 'text-orange-600 bg-orange-50 border-orange-200' },
                { key: 'approved_by_president', label: 'موافقت و بایگانی', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
              ];
              const curStatus = statuses.find(s => s.key === sub.status);

              return (
                <div key={sub.id} className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs transition-all">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{sub.createdAt}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${curStatus?.color}`}>
                      {curStatus?.label}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-2">{sub.templateTitle}</h4>

                  {/* Attachment indicator */}
                  {sub.attachment && (
                    <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-2">
                      <Paperclip className="w-3 h-3" />
                      <span>فایل ضمیمه: {sub.attachment.name}</span>
                    </div>
                  )}

                  {/* Steps Progress Visualizer */}
                  <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[9px] font-semibold text-slate-400">تاریخچه ثبت تاییدات سازمانی:</p>
                    
                    <div className="relative pl-2 text-[11px] space-y-2">
                      {/* Step 1: Expert */}
                      <div className="flex items-start gap-1 text-slate-500">
                        <span className="text-emerald-600">✓</span>
                        <span>ارسال توسط: {sub.staffName} (کارشناس)</span>
                      </div>

                      {/* Step 2: Supervisor */}
                      {sub.supervisorApprovedAt ? (
                        <div className="flex flex-col pl-3 border-r border-emerald-300 pr-1 text-[10px] text-slate-600">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <span>✓</span>
                            <span>تایید سرپرست: {sub.supervisorName}</span>
                          </div>
                          <p className="bg-slate-50 border-r-2 border-slate-300 p-1.5 rounded text-[10px] text-slate-500 mt-1 italic">
                            💬 « {sub.supervisorComment} »
                          </p>
                        </div>
                      ) : sub.status === 'sent_to_supervisor' ? (
                        <div className="flex items-center gap-1 text-amber-500 pl-3 border-r border-dashed border-slate-300 pr-1">
                          <span className="animate-pulse">●</span>
                          <span>منتظر بررسی سرپرست واحد</span>
                        </div>
                      ) : null}

                      {/* Step 3: Manager */}
                      {sub.managerApprovedAt ? (
                        <div className="flex flex-col pl-3 border-r border-emerald-300 pr-1 text-[10px] text-slate-600">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <span>✓</span>
                            <span>تایید مدیر دپارتمان: {sub.managerName}</span>
                          </div>
                          <p className="bg-slate-50 border-r-2 border-slate-300 p-1.5 rounded text-[9px] text-slate-500 mt-1 italic">
                            💬 « {sub.managerComment} »
                          </p>
                        </div>
                      ) : sub.status === 'sent_to_manager' ? (
                        <div className="flex items-center gap-1 text-amber-500 pl-3 border-r border-dashed border-slate-300 pr-1">
                          <span className="animate-pulse">●</span>
                          <span>منتظر ارسال نظر مدیر دپارتمان</span>
                        </div>
                      ) : null}

                      {/* Step 4: President */}
                      {sub.presidentApprovedAt ? (
                        <div className="flex flex-col pl-3 pr-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50/50 p-2 rounded border border-emerald-100 mt-1">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <span>✓</span>
                            <span>امضاء قطعی ریاست: {sub.presidentName}</span>
                          </div>
                          <p className="border-r-2 border-emerald-500 p-1 rounded text-[9px] text-slate-600 mt-1 italic font-normal">
                            💬 « {sub.presidentComment} »
                          </p>
                        </div>
                      ) : sub.status === 'sent_to_president' ? (
                        <div className="flex items-center gap-1 text-amber-500 pl-3 border-r border-dashed border-slate-300 pr-1">
                          <span className="animate-pulse">●</span>
                          <span>در انتظار امضاء و دستور رئیس شرکت</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {sub.status === 'draft' && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        onClick={() => onDeleteSubmission(sub.id)}
                        className="text-[10px] font-semibold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded"
                      >
                        حذف درخواست
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main interaction workspace: Form Filler */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-sm font-bold">کارتابل ثبت و تکمیل فرم های اداری</h1>
              <p className="text-xs text-indigo-200">واحد فعال: {currentUser.unit} | کارشناس: {currentUser.name}</p>
            </div>
          </div>
          <span className="bg-indigo-800 text-indigo-200 text-[10px] boder border-indigo-700 px-2.5 py-1 rounded-full font-mono">
            کد ورود پرسنلی: {currentUser.code}
          </span>
        </div>

        <div className="p-6">
          {unitTemplates.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">هیچ قالبی برای واحد شما موجود نیست!</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                ادمین شبکه هنوز قالبی برای واحد «{currentUser.unit}» بارگذاری نکرده است. لطفا ابتدا وارد نقش <strong>ادمین شبکه</strong> شده و یک قالب یا فایل اکسل فرم طراحی و منتشر کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dropdown switch template */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">انتخاب فرم مورد نیاز برای تکمیل:</label>
                <div className="flex items-center gap-2">
                  <select
                    id="template-change-picker"
                    value={selectedTemplate?.id || ''}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold"
                  >
                    {unitTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold py-2 px-3 rounded-lg border border-indigo-100">
                    قالب فعال
                  </span>
                </div>
              </div>

              {/* Real form builder for selected template */}
              {selectedTemplate && (
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 mb-2">
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      شما در حال پر کردن «<span className="text-indigo-600 font-bold">{selectedTemplate.title}</span>» هستید. پس از ثبت نهایی، فرم بلافاصله به کارتابل سرپرست متعلق به واحد شما فرستاده می‌شود.
                    </p>
                  </div>

                  {selectedTemplate.fields.map(field => (
                    <div key={field.id} className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-705 flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-rose-500" title="تکمیل الزامی ہے">*</span>}
                      </label>

                      {field.type === 'text' && (
                        <input
                          type="text"
                          required={field.required}
                          value={formValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder="کیبورد فارسی یا لاتین"
                          className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                        />
                      )}

                      {field.type === 'number' && (
                        <input
                          type="number"
                          required={field.required}
                          value={formValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder="مقدار عددی معتبر"
                          className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                        />
                      )}

                      {field.type === 'textarea' && (
                        <textarea
                          required={field.required}
                          rows={4}
                          value={formValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder="توضیحات مفصل خود را در این بخش یادداشت بفرمایید تا برای مدیر کل ارجاع داده شود..."
                          className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                        />
                      )}

                      {field.type === 'dropdown' && (
                        <select
                          required={field.required}
                          value={formValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                        >
                          <option value="">-- یک گزینه انتخاب کنید --</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.type === 'checkbox' && (
                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={formValues[field.id] || false}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-slate-400 accent-indigo-600"
                          />
                          <span className="text-xs text-slate-600 font-medium">{field.label}</span>
                        </label>
                      )}
                    </div>
                  ))}

                  {/* Attachment Simulator */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      آپلود فایل ضمیمه (عکس پروفرما، فاکتور، سند فنی دستگاه یا ضمیمه تکمیلی) [اختیاری]
                    </label>

                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const f = e.dataTransfer.files[0];
                          setAttachment({ name: f.name, size: `${(f.size/1024/1024).toFixed(1)} MB`, type: f.type });
                        }
                      }}
                      className={`border border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragActive ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="file"
                        id="form-attachment-input"
                        className="hidden"
                        onChange={simulateFileUpload}
                      />
                      <label htmlFor="form-attachment-input" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-600">
                        <FileUp className="w-4 h-4 text-slate-400" />
                        <span>فایل خود را رها کنید یا به کارت پیوست ضربه بزنید</span>
                      </label>
                    </div>

                    {attachment && (
                      <div className="flex items-center justify-between bg-slate-100 p-2 rounded text-xs">
                        <span className="font-mono text-slate-700 font-medium truncate">{attachment.name} ({attachment.size})</span>
                        <button
                          type="button"
                          onClick={() => setAttachment(null)}
                          className="text-rose-500 font-bold px-1.5 hover:bg-slate-200 rounded"
                        >
                          حذف پیوست
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
                    >
                      ذخیره به عنوان پیش‌نویس موقت
                    </button>

                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 text-xs font-bold transition-all shadow flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4 flip-h" />
                      امضا و ارسال فوری به سرپرست واحد
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
