import React, { useState } from 'react';
import { User, FormSubmission, FormTemplate } from '../types';
import { ClipboardList, ShieldAlert, CheckSquare, CornerDownRight, MessageSquareCode, Clock, FileCheck, CheckCircle2, RefreshCw } from 'lucide-react';

interface SupervisorReviewProps {
  currentUser: User;
  submissions: FormSubmission[];
  templates: FormTemplate[];
  onApproveBySupervisor: (id: string, comment: string, supervisorName: string) => void;
  onRejectBySupervisor: (id: string) => void;
}

export default function SupervisorReview({
  currentUser,
  submissions,
  templates,
  onApproveBySupervisor,
  onRejectBySupervisor
}: SupervisorReviewProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Filter submissions waiting for supervisor review in this supervisor's unit
  const pendingSubmissions = submissions.filter(
    s => s.status === 'sent_to_supervisor' && (s.unit === currentUser.unit || currentUser.unit === 'عمومی')
  );

  const selectedSub = submissions.find(s => s.id === selectedSubId);
  const selectedTemplate = selectedSub ? templates.find(t => t.id === selectedSub.templateId) : null;

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubId) return;
    if (!commentText.trim()) {
      alert('لطفاً نظر کارشناسی یا یادداشت سرپرست را برای ارجاع به مدیر کل وارد کنید.');
      return;
    }

    onApproveBySupervisor(selectedSubId, commentText, currentUser.name);
    setSelectedSubId(null);
    setCommentText('');
    alert('فرم با موفقیت تایید و برای مدیر ارشد دپارتمان ارسال شد.');
  };

  const handleReject = () => {
    if (!selectedSubId) return;
    if (confirm('آیا مایلید این فرم را جهت اصلاحات به کارشناس عودت دهید؟ فرم مجددا در بخش پیش‌نویس‌های ایشان قرار خواهد گرفت.')) {
      onRejectBySupervisor(selectedSubId);
      setSelectedSubId(null);
      setCommentText('');
      alert('فرم با موفقیت جهت اصلاح به کارشناس مربوطه بازگردانده شد.');
    }
  };

  return (
    <div id="supervisor-review-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      {/* Sidebar: Requests list */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-between leading-none">
          <span className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-amber-500" />
            فرم‌های نیازمند تایید سرپرست ({pendingSubmissions.length})
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">واحد کارگاهی: {currentUser.unit}</span>
        </h3>

        <div className="space-y-3">
          {pendingSubmissions.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">کار قدیمی معوقه‌ای وجود ندارد!</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                تمام فرم‌های ارسالی کارشناسان فورا تایید و به کارتابل مدیر کل ارجاع داده شده‌اند.
              </p>
            </div>
          ) : (
            pendingSubmissions.map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelectedSubId(sub.id); setCommentText(''); }}
                className={`w-full text-right bg-white border rounded-xl p-4 transition-all duration-200 flex flex-col gap-2 cursor-pointer ${
                  selectedSubId === sub.id
                    ? 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start w-full gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{sub.createdAt}</span>
                  <span className="text-[9px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-100">در انتظار تایید شما</span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 mb-0.5 line-clamp-1">{sub.templateTitle}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-700">تهیه کننده:</span>
                  <span>{sub.staffName} (کد: {sub.staffCode})</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Review interface */}
      <div className="lg:col-span-7">
        {!selectedSub ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-400 h-full flex flex-col justify-center">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h4 className="text-xs font-bold text-slate-700">هیچ درخواستی انتخاب نشده است</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              لطفاً یکی از فرم‌های در انتظار بررسی سمت راست را انتخاب کنید تا فیلدهای تکمیل شده توسط کارمندان را مشاهده کرده و امضا مقتضی بزنید.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header banner */}
            <div className="bg-amber-800 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] bg-amber-900 border border-amber-700 text-amber-200 px-2.5 py-0.5 rounded-full font-bold">مرحله ۲: بررسی و تایید سرپرست واحد کارگاه</span>
                <h3 className="text-xs font-bold mt-1 text-slate-100">{selectedSub.templateTitle}</h3>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-amber-200 font-semibold">ارسال از طرف: {selectedSub.staffName}</p>
                <p className="text-[9px] text-amber-300 font-mono">تاریخ ثبت: {selectedSub.createdAt}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Form entries list */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3 flex items-center gap-1">
                  <span>📋 فیلدهای تکمیل شده توسط کارشناس:</span>
                </h4>

                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3">
                  {selectedTemplate?.fields.map(field => {
                    const value = selectedSub.fieldsData[field.id];
                    return (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1 text-xs">
                        <span className="font-semibold text-slate-500 md:col-span-1">{field.label}:</span>
                        <div className="md:col-span-3 text-slate-800">
                          {field.type === 'checkbox' ? (
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${value ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {value ? 'بلی، تایید شده است' : 'خیر، تایید نشده'}
                            </span>
                          ) : (
                            <span className="font-semibold text-slate-900">{value !== undefined ? String(value) : 'تکمیل نشده'}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {selectedSub.attachment && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        📎 فایل اسکن شده ضمیمه شده:
                      </span>
                      <a
                        href="#/"
                        onClick={(e) => { e.preventDefault(); alert(`شبیه سازی دانلود فایل ضمیمه: ${selectedSub.attachment?.name}`); }}
                        className="text-[10px] text-indigo-600 hover:underline bg-indigo-50 px-2 py-1 rounded"
                      >
                        {selectedSub.attachment.name} ({selectedSub.attachment.size})
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action comment box */}
              <form onSubmit={handleApprove} className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>✍ نظرات کارشناسی و یادداشت سرپرست برای مدیر کل:</span>
                    <span className="text-[10px] text-amber-600 font-semibold">* تکمیل این بند الزامی است</span>
                  </label>
                  <textarea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="جهت تایید نهایی فرم، نظر مکتوب خود در رابطه با کارهای انجام شده یا عیب یابی ها در این قسمت درج کنید. این نظر برای مدیران بالاتر و رئیس شرکت نمایش داده خواهد شد..."
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                  />
                </div>

                {/* Submit actions buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg px-4 py-2 text-xs font-bold transition-colors"
                  >
                    ارجاع جهت اصلاح مدارک (عودت به کارشناس)
                  </button>

                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-5 py-2 text-xs font-bold transition-all shadow flex items-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4" />
                    موافقت و ارسال به مدیر دپارتمان
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
