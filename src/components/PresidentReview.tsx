import React, { useState } from 'react';
import { User, FormSubmission, FormTemplate } from '../types';
import { Crown, CheckSquare, MessageSquare, Printer, Award, FileCheck, CheckCircle2, FileText, ChevronLeft } from 'lucide-react';

interface PresidentReviewProps {
  currentUser: User;
  submissions: FormSubmission[];
  templates: FormTemplate[];
  onApproveByPresident: (id: string, comment: string, presidentName: string) => void;
}

export default function PresidentReview({
  currentUser,
  submissions,
  templates,
  onApproveByPresident
}: PresidentReviewProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [presidentComment, setPresidentComment] = useState('');
  const [showPrintView, setShowPrintView] = useState(false);

  // Filter submissions waiting for president (CEO) review (sent_to_president status)
  const pendingSubmissions = submissions.filter(s => s.status === 'sent_to_president');
  
  // Filter approved/archived submissions to allow printing past approved letters
  const approvedSubmissions = submissions.filter(s => s.status === 'approved_by_president');

  const selectedSub = submissions.find(s => s.id === selectedSubId);
  const selectedTemplate = selectedSub ? templates.find(t => t.id === selectedSub.templateId) : null;

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubId) return;
    if (!presidentComment.trim()) {
      alert('لطفاً نظر نهایی و امضای ریاست محترم را بنویسید.');
      return;
    }

    onApproveByPresident(selectedSubId, presidentComment, currentUser.name);
    setPresidentComment('');
    alert('فرم با موفقیت امضا، تایید نهایی و در پورتال اصلی شرکت بایگانی گردید!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="president-review-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      {/* Sidebar: Requests queue */}
      <div className="lg:col-span-4 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 leading-none mb-3">
            <Crown className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>در انتظار تایید و امضای شما ({pendingSubmissions.length})</span>
          </h3>

          <div className="space-y-3">
            {pendingSubmissions.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-[11px] font-semibold text-slate-700">فرم معوقه‌ای وجود ندارد</p>
                <p className="text-[9px] text-slate-400 mt-1">کلیه پیگیری‌ها و فرم‌ها بررسی و نهایی شده‌اند.</p>
              </div>
            ) : (
              pendingSubmissions.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => { setSelectedSubId(sub.id); setPresidentComment(''); setShowPrintView(false); }}
                  className={`w-full text-right bg-white border rounded-xl p-3.5 transition-all flex flex-col gap-1.5 cursor-pointer ${
                    selectedSubId === sub.id && !showPrintView
                      ? 'border-amber-600 ring-2 ring-amber-500/10 bg-amber-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-mono text-slate-400">{sub.createdAt}</span>
                    <span className="text-[9px] bg-rose-50 border border-rose-200 text-rose-700 font-bold px-1.5 py-0.5 rounded">نامه‌ ارجاعی فوری</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{sub.templateTitle}</h4>
                  <p className="text-[10px] text-slate-500">متقاضی: {sub.staffName} ({sub.unit})</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* List of completed archives with quick PDF export visualizer */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 leading-none mb-3">
            <Printer className="w-4 h-4 text-slate-400" />
            <span>بایگانی فرم‌های موافقت شده ({approvedSubmissions.length})</span>
          </h3>

          <div className="space-y-2">
            {approvedSubmissions.map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelectedSubId(sub.id); setShowPrintView(true); }}
                className={`w-full text-right bg-slate-50 border rounded-lg p-2.5 hover:bg-white hover:border-slate-300 transition-all text-xs flex items-center justify-between cursor-pointer ${
                  selectedSubId === sub.id && showPrintView ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">{sub.templateTitle}</span>
                </div>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded shrink-0"> PDF چاپ</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="lg:col-span-8">
        {!selectedSub ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-400 h-full flex flex-col justify-center">
            <Crown className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h4 className="text-xs font-bold text-slate-700">کارپوشه امضای عالی ریاست</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              لطفا فرم‌های مکتوب ارجاع داده شده از سطوح سرپرستی و مدیریت کل را انتخاب و جزییات تاییدات را مطالعه فرمایید تا دستور ارجاع مقتضی صادر کنید.
            </p>
          </div>
        ) : showPrintView ? (
          /* PDF Print layout Simulator */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowPrintView(false)}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 py-1.5 px-3 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" /> بازگشت به نمای کارتابل اصلی
              </button>
              
              <button
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-1.5 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> چاپ نامه / ذخیره به عنوان خروجی PDF
              </button>
            </div>

            {/* Simulated letter sheet */}
            <div id="printable-letterhead" className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm print:shadow-none print:border-none print:p-0 max-w-[21cm] mx-auto text-slate-900 leading-normal font-sans">
              
              {/* Cover Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-5">
                <div className="text-right text-[11px] text-slate-500 w-1/3">
                  <p>شماره اندیکاتور: <strong className="font-mono text-slate-700">۱۴۰۵/{selectedSub.id.replace('sub_', '')}</strong></p>
                  <p>تاریخ ثبت درخواست: <strong className="font-mono text-slate-700">{selectedSub.createdAt.split(' ')[0]}</strong></p>
                  <p>پیوست مدارک: <strong className="text-slate-700">{selectedSub.attachment ? 'دارد (فایل دیجیتال)' : 'ندارد'}</strong></p>
                </div>
                
                <div className="text-center w-1/3">
                  <h2 className="text-sm font-bold tracking-wider text-slate-900">شرکت بازرگانی و صنعتی پویان کالا (سهامی خاص)</h2>
                  <p className="text-[10px] text-slate-500 mt-0.5">سامانه جامع اتوماسیون اداری و گردش کاری داخلی</p>
                  <p className="text-[11px] font-bold text-slate-800 bg-slate-100 rounded px-2 py-0.5 mt-2 inline-block">نسخه چاپی رسمی فرم اداری</p>
                </div>
                
                <div className="w-1/3 flex justify-end">
                  {/* Decorative Logo simulation */}
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg border-2 border-slate-100">
                    P
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div className="my-4">
                <h3 className="text-xs font-bold text-slate-900 mb-1">نام قالب فرم سازمانی: {selectedSub.templateTitle}</h3>
                <p className="text-[10px] text-slate-500">فرم ارسالی از واحد سازمانی: <strong>{selectedSub.unit}</strong></p>
              </div>

              {/* Submitted fields table */}
              <div className="my-5">
                <table className="w-full text-xs text-right border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-400">
                      <th className="border border-slate-400 p-2 w-1/3">عنوان فیلد اطلاعاتی</th>
                      <th className="border border-slate-400 p-2 w-2/3">مقدار ثبت شده توسط کارمند</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {selectedTemplate?.fields.map(field => {
                      const value = selectedSub.fieldsData[field.id];
                      return (
                        <tr key={field.id}>
                          <td className="border border-slate-400 p-2 font-semibold text-slate-700">{field.label}</td>
                          <td className="border border-slate-400 p-2 text-slate-900 font-medium">
                            {field.type === 'checkbox' ? (value ? 'تأیید و رعایت کامل شده است' : 'خیر') : String(value || 'خالی')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Signatures Timeline cascade */}
              <div className="space-y-4 my-6">
                <h4 className="text-xs font-bold text-slate-900 border-b border-dashed border-slate-300 pb-1.5 flex items-center gap-1">
                  <span>✒ سلسله مراتب امضاءها و موافقت‌نامه‌های بخش‌ها:</span>
                </h4>

                {/* 1. Expert */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                  <div className="md:col-span-8">
                    <p className="font-semibold text-slate-800">۱. ثبت و امضاء دیجیتال کارشناس:</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      صحت مقادیر و اسناد بالا مورد تایید کارشناس مربوطه می‌باشد.
                    </p>
                  </div>
                  <div className="md:col-span-4 text-left md:border-r md:border-slate-300 pr-2">
                    <p className="font-bold text-slate-800">{selectedSub.staffName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">تاریخ امضا: {selectedSub.createdAt}</p>
                  </div>
                </div>

                {/* 2. Supervisor */}
                {selectedSub.supervisorApprovedAt && (
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                    <div className="md:col-span-8">
                      <p className="font-semibold text-slate-800">۲. موافقت و تایید سرپرست واحد کارگاه:</p>
                      <p className="text-[11px] text-slate-600 italic mt-1">
                        💬 « {selectedSub.supervisorComment} »
                      </p>
                    </div>
                    <div className="md:col-span-4 text-left md:border-r md:border-slate-300 pr-2">
                      <p className="font-bold text-slate-800">{selectedSub.supervisorName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">تاریخ امضا: {selectedSub.supervisorApprovedAt}</p>
                    </div>
                  </div>
                )}

                {/* 3. Manager */}
                {selectedSub.managerApprovedAt && (
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                    <div className="md:col-span-8">
                      <p className="font-semibold text-slate-800">۳. تایید مدیریتی مدیر دپارتمان:</p>
                      <p className="text-[11px] text-slate-600 italic mt-1">
                        💬 « {selectedSub.managerComment} »
                      </p>
                    </div>
                    <div className="md:col-span-4 text-left md:border-r md:border-slate-300 pr-2">
                      <p className="font-bold text-slate-800">{selectedSub.managerName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">تاریخ امضا: {selectedSub.managerApprovedAt}</p>
                    </div>
                  </div>
                )}

                {/* 4. President Final approved comment */}
                {selectedSub.presidentApprovedAt && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-300 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                    <div className="md:col-span-8">
                      <p className="font-bold text-slate-900 text-sm">۴. دستور نهایی و امضای عالی ریاست شرکت:</p>
                      <p className="text-xs text-slate-700 italic font-semibold mt-1.5 leading-relaxed">
                        💬 « {selectedSub.presidentComment} »
                      </p>
                    </div>
                    <div className="md:col-span-4 text-left md:border-r md:border-amber-300 pr-3">
                      <p className="font-bold text-amber-950 text-base font-serif">{selectedSub.presidentName}</p>
                      <p className="text-[10px] text-amber-900 font-mono">تاریخ توشیح: {selectedSub.presidentApprovedAt}</p>
                      <div className="mt-3 inline-block border-2 border-emerald-600 text-emerald-700 px-3 py-1 text-[11px] rounded bg-emerald-100/50 font-bold uppercase rotate-[-3deg]">
                        مهر و امضا ابلاغ شد
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informative footer */}
              <div className="text-center text-[10px] text-slate-400 mt-10 pt-4 border-t border-slate-200">
                مکاتبات این کارتابل طبق قانون همسان‌سازی نظام تبادل الکترونیک اسناد سازمانی پویان کالا، دارای ارزش اجرایی قانونی می‌باشد.
              </div>
            </div>
          </div>
        ) : (
          /* Main Form reviews screen */
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header banner */}
            <div className="bg-amber-900 text-white p-4.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] bg-amber-950 border border-amber-800 text-amber-200 px-2.5 py-0.5 rounded-full font-bold">بخش حاکمیتی: کارتابل ریاست کل سازمان</span>
                <h3 className="text-xs font-bold mt-1 text-slate-100">{selectedSub.templateTitle}</h3>
              </div>
              <div className="text-left text-xs text-amber-200">
                <p>متقاضی: {selectedSub.staffName} ({selectedSub.unit})</p>
                <p className="font-mono text-[10px]">کد پرسنلی متقاضی: {selectedSub.staffCode}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Core attributes list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Inputs summary */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5">📋 اقلام و فیلدهای ثبت شده:</h4>
                  <div className="space-y-2 text-xs">
                    {selectedTemplate?.fields.map(field => {
                      const val = selectedSub.fieldsData[field.id];
                      return (
                        <div key={field.id} className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">{field.label}:</span>
                          <span className="font-bold text-slate-900">{field.type === 'checkbox' ? (val ? 'بلی' : 'خیر') : String(val)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Comments review loop */}
                <div className="space-y-4">
                  {/* Supervisor */}
                  <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-lg text-xs">
                    <p className="font-semibold text-indigo-900 flex justify-between">
                      <span>👤 نظر سرپرست: {selectedSub.supervisorName}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{selectedSub.supervisorApprovedAt}</span>
                    </p>
                    <p className="text-slate-600 mt-1 leading-relaxed italic">« {selectedSub.supervisorComment} »</p>
                  </div>

                  {/* Manager */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-lg text-xs">
                    <p className="font-semibold text-emerald-900 flex justify-between">
                      <span>👤 نظر مدیر دپارتمان: {selectedSub.managerName}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{selectedSub.managerApprovedAt}</span>
                    </p>
                    <p className="text-slate-600 mt-1 leading-relaxed italic">« {selectedSub.managerComment} »</p>
                  </div>
                </div>
              </div>

              {/* Action comment box */}
              <form onSubmit={handleApprove} className="space-y-3 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ✍ دستور و توشیحات نهایی عالی ریاست جهت بایگانی و ابلاغ:
                  </label>
                  <textarea
                    rows={4}
                    value={presidentComment}
                    onChange={(e) => setPresidentComment(e.target.value)}
                    placeholder="دستورات نهایی ابلاغ به مالی، پرداخت اضافه کار، موافقت با مرخصی کارمند یا تایید فاکتورهای فنی را به صورت رسمی درج بفرمایید..."
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                  />
                </div>

                {/* Action steps */}
                <div className="pt-2 text-left">
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-6 py-2.5 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 inline-block"
                  >
                    <FileCheck className="w-4 h-4" />
                    امضاء و ابلاغ نهایی سند اداری
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
