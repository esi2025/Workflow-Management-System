import React, { useState } from 'react';
import { User, FormSubmission, FormTemplate, WorkflowDeadlines } from '../types';
import { ClipboardList, ShieldAlert, CheckSquare, CornerDownRight, MessageSquareCode, Clock, FileCheck, CheckCircle2, RefreshCw, AlertCircle, Filter } from 'lucide-react';
import { toPersianDate, getOverdueInfo } from '../utils/dateConverter';
import SubmissionHistoryLog from './SubmissionHistoryLog';

interface SupervisorReviewProps {
  currentUser: User;
  submissions: FormSubmission[];
  templates: FormTemplate[];
  onApproveBySupervisor: (id: string, comment: string, supervisorName: string) => void;
  onRejectBySupervisor: (id: string, name: string) => void;
  onRecordView?: (id: string, viewer: User) => void;
  deadlines: WorkflowDeadlines;
}

export default function SupervisorReview({
  currentUser,
  submissions,
  templates,
  onApproveBySupervisor,
  onRejectBySupervisor,
  onRecordView,
  deadlines
}: SupervisorReviewProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Filtering states
  const [unitFilter, setUnitFilter] = useState<string>(currentUser.unit === 'عمومی' ? 'all' : currentUser.unit);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  // Find unique units for selection
  const uniqueUnits = Array.from(new Set(submissions.map(s => s.unit).filter(Boolean)));

  // Filter submissions dynamically
  const filteredSubmissions = submissions.filter(s => {
    // Hide drafts from supervisor list
    if (s.status === 'draft') return false;

    // Filter by Emitting Unit/Department
    if (unitFilter !== 'all' && s.unit !== unitFilter) return false;

    // Filter by Status
    if (statusFilter === 'pending' && s.status !== 'sent_to_supervisor') return false;
    if (statusFilter === 'approved' && s.status === 'sent_to_supervisor') return false;

    return true;
  });

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
      onRejectBySupervisor(selectedSubId, currentUser.name);
      setSelectedSubId(null);
      setCommentText('');
      alert('فرم با موفقیت جهت اصلاح به کارشناس مربوطه بازگردانده شد.');
    }
  };

  const handleSelectSub = (subId: string) => {
    setSelectedSubId(subId);
    setCommentText('');
    if (onRecordView) {
      onRecordView(subId, currentUser);
    }
  };

  return (
    <div id="supervisor-review-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      {/* Sidebar: Requests list */}
      <div className="lg:col-span-5 space-y-4">
        {/* Filters Panel */}
        <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-300">
              <Filter className="w-4 h-4 text-slate-500 animate-none" />
              <span>فیلترهای گزارش‌ها</span>
            </span>
            <span className="text-[10px] text-slate-400">واحد شما: {currentUser.unit}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[9px] text-slate-500 block mb-0.5">دپارتمان</label>
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-bold"
              >
                <option value="all">همه دپارتمان‌ها</option>
                {uniqueUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] text-slate-500 block mb-0.5">وضعیت گردش کار</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-bold"
              >
                <option value="all">همه فرم‌ها</option>
                <option value="pending">در انتظار سرپرست</option>
                <option value="approved">تأیید/مراحل بعدی</option>
              </select>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-between leading-none">
          <span className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-amber-500" />
            کارتابل مکتوب سرپرست ({filteredSubmissions.length})
          </span>
        </h3>

        <div className="space-y-3">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 animate-none" />
              <p className="text-xs font-semibold text-slate-750">موردی یافت نشد!</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                هیچ فرمی با فیلترهای کنونی در کارتابل سرپرست مطابقت ندارد.
              </p>
            </div>
          ) : (
            filteredSubmissions.map(sub => {
              const overdueInfo = getOverdueInfo(sub, 'supervisor', deadlines);
              const isPending = sub.status === 'sent_to_supervisor';
              const showOverdueAlert = isPending && overdueInfo.isOverdue;

              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSub(sub.id)}
                  className={`w-full text-right border rounded-xl p-4 transition-all duration-200 flex flex-col gap-2 cursor-pointer ${
                    selectedSubId === sub.id
                      ? showOverdueAlert
                        ? 'border-rose-500 ring-2 ring-rose-505/20 bg-rose-50/10'
                        : 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/10'
                      : showOverdueAlert
                      ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-455'
                      : 'border-slate-201 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center w-full gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{toPersianDate(sub.createdAt)}</span>
                    {isPending ? (
                      showOverdueAlert ? (
                        <span className="text-[8px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800/40 flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" />
                          <span>خارج از مهلت بررسی</span>
                        </span>
                      ) : (
                        <span className="text-[8px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-500 animate-none" />
                          <span>در انتظار تایید شما</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[8px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1 select-none">
                        <FileCheck className="w-2.5 h-2.5 text-emerald-500" />
                        <span>تأیید شده</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mb-0.5 line-clamp-1">{sub.templateTitle}</h4>
                  
                  <div className="flex flex-wrap justify-between items-center gap-2 mt-1 pt-1.5 border-t border-slate-100/60">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">تهیه کننده:</span>
                      <span>{sub.staffName} ({sub.unit})</span>
                    </div>

                    {isPending && (
                      <div className={`text-[9px] font-semibold ${showOverdueAlert ? 'text-rose-600 font-bold animate-pulse' : 'text-slate-500'}`}>
                        {overdueInfo.text}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
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
              <div className="text-left w-auto shrink-0 select-none">
                <p className="text-[10px] text-amber-200 font-semibold mb-0.5">ارسال از طرف: {selectedSub.staffName}</p>
                <p className="text-[10px] text-amber-100 font-medium">تاریخ ثبت: {toPersianDate(selectedSub.createdAt)}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* SLA Warning Banner inside detail view */}
              {(() => {
                const overdueInfo = getOverdueInfo(selectedSub, 'supervisor', deadlines);
                const isPending = selectedSub.status === 'sent_to_supervisor';
                if (!isPending) return null;
                return (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-sans ${
                    overdueInfo.isOverdue
                      ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-955/20 dark:border-rose-900 dark:text-rose-300'
                      : 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-955/20 dark:border-emerald-900/40 dark:text-emerald-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${overdueInfo.isOverdue ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
                      <div>
                        <span className="font-bold">وضعیت مهلت بررسی پورتال (SLA):</span>{' '}
                        <span className="font-semibold">{overdueInfo.text}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white/70 dark:bg-slate-900/60 px-2 by-0.5 rounded font-mono">ارجاع: {selectedSub.createdAt}</span>
                  </div>
                );
              })()}

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

              {/* Event Logs Trace Timeline */}
              <SubmissionHistoryLog submission={selectedSub} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
