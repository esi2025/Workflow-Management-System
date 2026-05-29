import React, { useState } from 'react';
import { User, FormSubmission, FormTemplate } from '../types';
import { Newspaper, MessageSquare, Award, ArrowLeftRight, CheckCircle, HelpCircle, FileCheck, ThumbsDown } from 'lucide-react';

interface ManagerReviewProps {
  currentUser: User;
  submissions: FormSubmission[];
  templates: FormTemplate[];
  onApproveByManager: (id: string, comment: string, managerName: string) => void;
  onRejectByManager: (id: string) => void;
}

export default function ManagerReview({
  currentUser,
  submissions,
  templates,
  onApproveByManager,
  onRejectByManager
}: ManagerReviewProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [managerComment, setManagerComment] = useState('');

  // Filter submissions waiting for department manager review
  const pendingSubmissions = submissions.filter(
    s => s.status === 'sent_to_manager' && (s.unit === currentUser.unit || currentUser.unit === 'عمومی')
  );

  const selectedSub = submissions.find(s => s.id === selectedSubId);
  const selectedTemplate = selectedSub ? templates.find(t => t.id === selectedSub.templateId) : null;

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubId) return;
    if (!managerComment.trim()) {
      alert('لطفاً نظر مدیریتی یا دستورات اجرایی خود را وارد کنید.');
      return;
    }

    onApproveByManager(selectedSubId, managerComment, currentUser.name);
    setSelectedSubId(null);
    setManagerComment('');
    alert('فرم با موفقیت تأیید شد و جهت دستور نهایی به کارتابل رئیس شرکت ارجاع داده شد.');
  };

  const handleReject = () => {
    if (!selectedSubId) return;
    if (confirm('آیا مایلید این فرم را جهت نیاز به بازنگری بیشتر به سرپرست تاییدکننده ارجاع دهید؟')) {
      onRejectByManager(selectedSubId);
      setSelectedSubId(null);
      setManagerComment('');
      alert('فرم با موفقیت جهت شفاف‌سازی بیشتر به کارتابل سرپرست عودت داده شد.');
    }
  };

  return (
    <div id="manager-review-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      {/* Sidebar: Submissions under review */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 flex items-center justify-between gap-1 leading-none">
          <span className="flex items-center gap-1.5">
            <Newspaper className="w-4 h-4 text-emerald-500" />
            کارتابل تائید مدیران دپارتمان ({pendingSubmissions.length})
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">دپارتمان: {currentUser.unit}</span>
        </h3>

        <div className="space-y-3">
          {pendingSubmissions.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-pulse" />
              <p className="text-xs font-semibold text-slate-700">کارپوشه کاملا خالی است!</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                تمام موارد ارجاعی از سرپرستان واحدهای زیرمجموعه در دپارتمان شما با موفقیت تایید و جهت امضای مدیریت نهایی به هیئت مدیره ارسال شده‌اند.
              </p>
            </div>
          ) : (
            pendingSubmissions.map(sub => (
              <button
                key={sub.id}
                onClick={() => { setSelectedSubId(sub.id); setManagerComment(''); }}
                className={`w-full text-right bg-white border rounded-xl p-4 transition-all duration-200 flex flex-col gap-2 cursor-pointer ${
                  selectedSubId === sub.id
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start w-full gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{sub.createdAt}</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-100">در انتظار امضای شما</span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 mb-0.5 line-clamp-1">{sub.templateTitle}</h4>
                <div className="text-[10px] text-slate-500 space-y-0.5">
                  <p>کارشناس دپارتمان: <span className="text-slate-700 font-medium">{sub.staffName}</span></p>
                  <p className="text-slate-400">تأییدیه اولیه: <span className="text-indigo-600 font-medium">{sub.supervisorName}</span></p>
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
            <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h4 className="text-xs font-bold text-slate-700">هیچ درخواستی جهت تایید انتخاب نشده است</h4>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              لطفاً یکی از فرم‌های تایید شده توسط سرپرستان را از کارپوشه سمت راست گزینش کنید تا بتوانید جزییات یادداشت‌های کارگاهی و فیلدهای مقادیری آنها را بررسی کنید.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header banner */}
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] bg-emerald-900 border border-emerald-700 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">مرحله ۳: تایید نهایی مدیریت دپارتمان</span>
                <h3 className="text-xs font-bold mt-1 text-slate-100">{selectedSub.templateTitle}</h3>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-emerald-200">دپارتمان: {selectedSub.unit}</p>
                <p className="text-[9px] text-emerald-300 font-mono">کارشناس: {selectedSub.staffName}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Form entries list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1">
                  <span>📋 جزییات مقادیر فرم و امضاهای قبلی:</span>
                </h4>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  {/* Values */}
                  {selectedTemplate?.fields.map(field => {
                    const value = selectedSub.fieldsData[field.id];
                    return (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-1 py-1 text-xs">
                        <span className="font-semibold text-slate-500 md:col-span-1">{field.label}:</span>
                        <div className="md:col-span-3 text-slate-800">
                          {field.type === 'checkbox' ? (
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${value ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {value ? 'بلی، تایید شده' : 'خیر'}
                            </span>
                          ) : (
                            <span className="font-semibold text-slate-900">{value !== undefined ? String(value) : 'خالی'}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Attachment */}
                  {selectedSub.attachment && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>📎 سند اسکن شده ضمیمه کارشناس:</span>
                      <span className="font-semibold text-indigo-600">{selectedSub.attachment.name} ({selectedSub.attachment.size})</span>
                    </div>
                  )}
                </div>

                {/* Supervisor's Comment Review - High Highlight */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800">
                      یادداشت و تاییدیه سرپرستان مستقیم واحد: {selectedSub.supervisorName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">({selectedSub.supervisorApprovedAt})</span>
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-amber-100 leading-relaxed italic">
                    « {selectedSub.supervisorComment} »
                  </p>
                </div>
              </div>

              {/* Action comment box */}
              <form onSubmit={handleApprove} className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>✍ صدور دستورات مدیریتی و تایید برای رئیس شرکت:</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">* ارسال به بالا</span>
                  </label>
                  <textarea
                    rows={4}
                    value={managerComment}
                    onChange={(e) => setManagerComment(e.target.value)}
                    placeholder="تحلیل مدیریتی، تخصیص بودجه یا توصیه‌های نهایی خود را برای امضای رئیس مکتوب فرمایید..."
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                  />
                </div>

                {/* Submit actions buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold transition-colors"
                  >
                    ارجاع به سرپرست جهت رفع ابهام
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2 text-xs font-bold transition-all shadow flex items-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4" />
                    تائید و ارسال فرادستگاهی به رئیس کل
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
