import React, { useState } from 'react';
import { User, FormTemplate, FormSubmission } from '../types';
import { FileText, Send, Paperclip, CheckCircle, Clock, AlertTriangle, ChevronRight, FileUp, Database, FileSpreadsheet, Play, Pause, Image as ImageIcon, FileCode, Video, Music } from 'lucide-react';

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
  
  // Time Tracking State (زمان شروع و پایان عملکرد)
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:30');

  // Attachment State
  const [attachment, setAttachment] = useState<{ name: string; size: string; type: string; url?: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Simulated sound state for demo
  const [isAudioPlaying, setIsAudioPlaying] = useState<Record<string, boolean>>({});

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

  // Preset generator for attachments of different types
  const attachPresetFile = (type: 'document' | 'audio' | 'image' | 'video') => {
    if (type === 'document') {
      setAttachment({
        name: 'نقشه_شفت_چپ_نهایی_فارسی_امضا.pdf',
        size: '3.8 MB',
        type: 'application/pdf'
      });
    } else if (type === 'audio') {
      setAttachment({
        name: 'گزارش_صوتی_توضیح_خرابی_پمپ.mp3',
        size: '1.2 MB',
        type: 'audio/mpeg',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Safe public audio
      });
    } else if (type === 'image') {
      setAttachment({
        name: 'وضعیت_بتن_تونل.png',
        size: '2.5 MB',
        type: 'image/png'
      });
    } else if (type === 'video') {
      setAttachment({
        name: 'گردش_کارگا_در_سایت.mp4',
        size: '14.2 MB',
        type: 'video/mp4'
      });
    }
    alert(`فایل ضمیمه از نوع ${type === 'document' ? 'سند معتبر' : type === 'audio' ? 'ضبط صوتی کارگاه' : type === 'image' ? 'تصویر دیجیتال' : 'ویدئوی پروژه'} الصاق گردید.`);
  };

  // Simulate file upload
  const simulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let fileType = 'document';
      if (file.type.startsWith('image/')) fileType = 'image';
      else if (file.type.startsWith('audio/')) fileType = 'audio';
      else if (file.type.startsWith('video/')) fileType = 'video';

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
      startTime,
      endTime,
      supervisorComment: null, supervisorApprovedAt: null, supervisorName: null,
      managerComment: null, managerApprovedAt: null, managerName: null,
      presidentComment: null, presidentApprovedAt: null, presidentName: null,
      status: isDraft ? 'draft' : 'sent_to_supervisor'
    };

    onCreateSubmission(newSub);
    setFormValues({});
    setAttachment(null);
    alert(isDraft ? 'پیش‌نویس با موفقیت ذخیره شد.' : 'گزارش شما با موفقیت ثبت شد و فورا به سرپرست واحد ارجاع گردید.');
  };

  return (
    <div id="staff-submission-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      
      {/* Sidebar: Submissions history with status tracking */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-none">
          <Database className="w-4 h-4 text-slate-500" />
          <span>فرم‌های ثبت شده شما ({mySubmissions.length})</span>
        </h3>

        <div className="space-y-3">
          {mySubmissions.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 text-center text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">شما هنوز هیچ فرمی در سیستم ثبت نکرده‌اید.</p>
              <p className="text-[10px] text-slate-450 mt-1">از فرم روبرو استفاده کرده و فرم جدید ایجاد کنید.</p>
            </div>
          ) : (
            mySubmissions.map(sub => {
              // Status steps UI details
              const statuses = [
                { key: 'draft', label: 'پیش‌نویس', color: 'text-slate-400 bg-slate-100 border-slate-200 dark:bg-slate-800/80 dark:border-slate-800' },
                { key: 'sent_to_supervisor', label: 'دست سرپرست', color: 'text-indigo-600 bg-indigo-50 border-indigo-250 dark:bg-indigo-950/20 dark:border-indigo-900 dark:text-indigo-400' },
                { key: 'sent_to_manager', label: 'دست مدیر بخش', color: 'text-amber-600 bg-amber-50 border-amber-250 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400' },
                { key: 'sent_to_president', label: 'دست رئیس شرکت', color: 'text-orange-600 bg-orange-50 border-orange-250 dark:bg-orange-950/20 dark:border-orange-900 dark:text-orange-405' },
                { key: 'approved_by_president', label: 'موافقت و بایگانی', color: 'text-emerald-600 bg-emerald-50 border-emerald-250 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400' }
              ];
              const curStatus = statuses.find(s => s.key === sub.status);

              return (
                <div key={sub.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 rounded-lg p-4 shadow-xs transition-all">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{sub.createdAt}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${curStatus?.color}`}>
                      {curStatus?.label}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150 line-clamp-1 mb-2">{sub.templateTitle}</h4>

                  {/* Start / End Time rendering */}
                  {sub.startTime && sub.endTime && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-mono bg-slate-50 dark:bg-slate-850 py-1 px-2 rounded w-fit">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>ساعت عملکرد: {sub.startTime} الی {sub.endTime}</span>
                    </div>
                  )}

                  {/* Attachment indicator with type-specific preview */}
                  {sub.attachment && (
                    <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800 mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 font-semibold">
                        {sub.attachment.type.includes('image') ? <ImageIcon className="w-3.5 h-3.5 text-rose-500" /> :
                         sub.attachment.type.includes('audio') ? <Music className="w-3.5 h-3.5 text-indigo-500" /> :
                         sub.attachment.type.includes('video') ? <Video className="w-3.5 h-3.5 text-amber-500" /> :
                         <FileCode className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="truncate flex-1 text-right">{sub.attachment.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">({sub.attachment.size})</span>
                      </div>

                      {/* Display visual thumbnail/player */}
                      {sub.attachment.type.includes('image') && (
                        <div className="relative border border-slate-150 dark:border-slate-750 rounded overflow-hidden h-20 bg-slate-200 dark:bg-slate-800">
                          <img
                            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400"
                            alt="Preview Worksite"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {sub.attachment.type.includes('audio') && (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-705">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAudioPlaying(prev => ({ ...prev, [sub.id]: !prev[sub.id] }));
                            }}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-indigo-600 dark:text-indigo-400 cursor-pointer"
                          >
                            {isAudioPlaying[sub.id] ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden relative">
                            <div className={`h-full bg-indigo-500 ${isAudioPlaying[sub.id] ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">01:45</span>
                        </div>
                      )}

                      {sub.attachment.type.includes('video') && (
                        <div className="relative border border-slate-150 dark:border-slate-800 rounded bg-slate-950 text-white flex items-center justify-center p-2 text-[10px] gap-1.5">
                          <Video className="w-4 h-4 text-amber-400" />
                          <span>ویدئوی ضبط شده شیفت کارگاهی</span>
                          <span className="text-[8px] bg-slate-800 px-1 py-0.5 rounded">۳۰ ثانیه</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Steps Progress Visualizer */}
                  <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-semibold text-slate-405">تاریخچه ثبت تاییدات مکتوب:</p>
                    
                    <div className="relative pl-1 text-[11px] space-y-2">
                      <div className="flex items-start gap-1 text-slate-500">
                        <span className="text-emerald-600">✓</span>
                        <span>ارسال توسط: {sub.staffName} (کارشناس)</span>
                      </div>

                      {sub.supervisorApprovedAt ? (
                        <div className="flex flex-col pr-2 border-r border-emerald-300 mr-1 text-[10px] text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <span>✓</span>
                            <span>تایید سرپرست: {sub.supervisorName}</span>
                          </div>
                          <p className="bg-slate-50 dark:bg-slate-850 border-r-2 border-slate-300 dark:border-slate-700 p-1 rounded text-[9px] text-slate-500 dark:text-slate-400 mt-1 italic">
                            💬 « {sub.supervisorComment} »
                          </p>
                        </div>
                      ) : sub.status === 'sent_to_supervisor' ? (
                        <div className="flex items-center gap-1 text-amber-500 pr-2 border-r border-dashed border-slate-300 dark:border-slate-755 mr-1 text-[10px]">
                          <span className="animate-pulse">●</span>
                          <span>منتظر بررسی سرپرست واحد</span>
                        </div>
                      ) : null}

                      {sub.managerApprovedAt ? (
                        <div className="flex flex-col pr-2 border-r border-emerald-300 mr-1 text-[10px] text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <span>✓</span>
                            <span>تایید مدیر دپارتمان: {sub.managerName}</span>
                          </div>
                          <p className="bg-slate-50 dark:bg-slate-850 border-r-2 border-slate-300 dark:border-slate-700 p-1.5 rounded text-[9px] text-slate-500 dark:text-slate-400 mt-1 italic">
                            💬 « {sub.managerComment} »
                          </p>
                        </div>
                      ) : sub.status === 'sent_to_manager' ? (
                        <div className="flex items-center gap-1 text-amber-500 pr-2 border-r border-dashed border-slate-300 dark:border-slate-755 mr-1 text-[10px]">
                          <span className="animate-pulse">●</span>
                          <span>منتظر ارسال نظر مدیر دپارتمان</span>
                        </div>
                      ) : null}

                      {sub.presidentApprovedAt ? (
                        <div className="flex flex-col pr-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded border border-emerald-100 dark:border-emerald-950 mt-1">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <span>✓</span>
                            <span>ریاست کل سازمان: {sub.presidentName}</span>
                          </div>
                          <p className="border-r-2 border-emerald-500 p-1 rounded text-[9px] text-slate-600 dark:text-slate-400 mt-1 italic font-normal">
                            💬 « {sub.presidentComment} »
                          </p>
                        </div>
                      ) : sub.status === 'sent_to_president' ? (
                        <div className="flex items-center gap-1 text-amber-500 pr-2 border-r border-dashed border-slate-300 dark:border-slate-755 mr-1 text-[10px]">
                          <span className="animate-pulse">●</span>
                          <span>در انتظار تایید و امضاء نهایی ریاست</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {sub.status === 'draft' && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                      <button
                        onClick={() => onDeleteSubmission(sub.id)}
                        className="text-[10px] font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-2 py-1 rounded cursor-pointer"
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
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-sm font-bold">کارتابل ثبت و تکمیل فرم های اداری</h1>
              <p className="text-xs text-indigo-205">واحد فعال: {currentUser.unit} | کارشناس محترم: {currentUser.name}</p>
            </div>
          </div>
          <span className="bg-indigo-800 text-indigo-200 text-[10px] border border-indigo-750 px-2.5 py-1 rounded-full font-mono font-bold">
            کد ورود پرسنلی: {currentUser.code}
          </span>
        </div>

        <div className="p-6">
          {unitTemplates.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 dark:bg-slate-850 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">هیچ قالبی برای واحد شما موجود نیست!</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                ادمین شبکه هنوز قالبی برای واحد «{currentUser.unit}» بارگذاری نکرده است. لطفا ابتدا وارد نقش <strong>ادمین شبکه</strong> شده و یک قالب یا فایل اکسل فرم طراحی و منتشر کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dropdown switch template */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">انتخاب فرم مورد نیاز برای تکمیل:</label>
                <div className="flex items-center gap-2">
                  <select
                    id="template-change-picker"
                    value={selectedTemplate?.id || ''}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {unitTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold py-2 px-3 rounded-lg border border-indigo-100 dark:border-indigo-950 whitespace-nowrap">
                    قالب فعال
                  </span>
                </div>
              </div>

              {/* Real form builder for selected template */}
              {selectedTemplate && (
                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="bg-slate-50/50 dark:bg-slate-850/50 p-3 rounded-lg border border-slate-150 dark:border-slate-800/80 mb-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                      شما در حال تکمیل «<span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedTemplate.title}</span>» هستید. گزارش شما ابتدا تحویل سرپرست متعلق به دپارتمان خواهد شد.
                    </p>
                  </div>

                  {/* TIME TRACKING FIELDS (Requested feature) */}
                  <div className="bg-indigo-50/40 dark:bg-indigo-955/20 border border-indigo-100 dark:border-indigo-950 p-4 rounded-xl space-y-3">
                    <p className="text-[11px] font-bold text-indigo-800 dark:text-indigo-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      زمان‌بندی تحقق عملکرد و مدت زمان اقدام
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="w-32 sm:w-36">
                        <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          ساعت شروع عملکرد روزانه
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="w-32 sm:w-36">
                        <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          ساعت پایان عملکرد روزانه
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Fields of the Template */}
                  <div className="space-y-4">
                    {selectedTemplate.fields.map(field => (
                      <div key={field.id} className="space-y-1">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-rose-500" title="تکمیل الزامی است">*</span>}
                        </label>

                        {field.type === 'text' && (
                          <input
                            type="text"
                            required={field.required}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder="کیبورد فارسی یا لاتین"
                            className="w-full bg-slate-50 hover:bg-slate-50 dark:bg-slate-850 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none text-slate-900 dark:text-slate-100 font-medium"
                          />
                        )}

                        {field.type === 'number' && (
                          <input
                            type="number"
                            required={field.required}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder="مقدار عددی معتبر"
                            className="w-full bg-slate-50 hover:bg-slate-50 dark:bg-slate-850 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none text-slate-900 dark:text-slate-100 font-mono"
                          />
                        )}

                        {field.type === 'textarea' && (
                          <textarea
                            required={field.required}
                            rows={4}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder="توضیحات مفصل عملکرد فنی یا اداری واحد خود را ثبت کنید..."
                            className="w-full bg-slate-50 hover:bg-slate-50 dark:bg-slate-850 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none text-slate-900 dark:text-slate-100"
                          />
                        )}

                        {field.type === 'dropdown' && (
                          <select
                            required={field.required}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-50 dark:bg-slate-850 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:outline-none text-slate-905 dark:text-slate-100 font-sans"
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
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{field.label}</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* MULTI-MEDIA ATTACHMENTS (Requested feature: Document, Audio, Image, Video) */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                      الصاق انواع پیوست‌های مجاز سازمانی (داکیومنت، مستند صوتی، تصویر فنی، یا ویدئوی کارگاهی)
                    </label>

                    {/* Preselected file fast generators to make testing a breeze */}
                    <div className="flex flex-wrap gap-2 pb-1.5 justify-start">
                      <button
                        type="button"
                        onClick={() => attachPresetFile('document')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-500" />
                        <span>📄 پیوست داکیومنت/پی‌دی‌اف</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => attachPresetFile('audio')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <Music className="w-3.5 h-3.5 text-indigo-500" />
                        <span>🎤 پیوست صدای ضبط‌شده</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => attachPresetFile('image')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                        <span>📸 پیوست نقشه/تصویر عکس</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => attachPresetFile('video')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-amber-500" />
                        <span>📹 پیوست ویدئو کارگاه</span>
                      </button>
                    </div>

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
                      className={`border border-dashed rounded-lg p-5 text-center transition-colors ${
                        dragActive ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="file"
                        id="form-attachment-input"
                        className="hidden"
                        onChange={simulateFileUpload}
                      />
                      <label htmlFor="form-attachment-input" className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <FileUp className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="font-semibold text-[11px]">پیوست فایل دلخواه از حافظه گوشی یا رایانه</span>
                        <span className="text-[10px] text-slate-400">کشیدن هرگونه سند، موزیک ضبط‌ شده، عکس یا ویدئو به این ناحیه</span>
                      </label>
                    </div>

                    {attachment && (
                      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/25 p-2.5 rounded-lg text-xs border border-emerald-150 dark:border-emerald-950">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="font-mono truncate max-w-sm">{attachment.name} ({attachment.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachment(null)}
                          className="text-rose-500 font-bold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                        >
                          پاک کردن پیوست
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      ذخیره به عنوان پیش‌نویس موقت
                    </button>

                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
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
