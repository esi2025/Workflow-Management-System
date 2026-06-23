import React, { useState } from 'react';
import { User, FormSubmission, FormTemplate, WorkflowDeadlines } from '../types';
import { Newspaper, MessageSquare, Award, ArrowLeftRight, CheckCircle, HelpCircle, FileCheck, ThumbsDown, BarChart3, TrendingUp, RefreshCw, ChevronDown, ChevronUp, Clock, List, AlertCircle, Filter } from 'lucide-react';
import { toPersianDate, getOverdueInfo } from '../utils/dateConverter';
import SubmissionHistoryLog from './SubmissionHistoryLog';
import SignatureCanvas from './SignatureCanvas';

interface ManagerReviewProps {
  currentUser: User;
  submissions: FormSubmission[];
  templates: FormTemplate[];
  onApproveByManager: (id: string, comment: string, managerName: string, rating?: number, signature?: string) => void;
  onRejectByManager: (id: string, name: string) => void;
  onRecordView?: (id: string, viewer: User) => void;
  deadlines: WorkflowDeadlines;
}

export default function ManagerReview({
  currentUser,
  submissions,
  templates,
  onApproveByManager,
  onRejectByManager,
  onRecordView,
  deadlines
}: ManagerReviewProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [managerComment, setManagerComment] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [statsViewTab, setStatsViewTab] = useState<'chart' | 'recent'>('chart');

  // Filtering states
  const [unitFilter, setUnitFilter] = useState<string>(currentUser.unit === 'عمومی' ? 'all' : currentUser.unit);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const uniqueUnits = Array.from(new Set(submissions.map(s => s.unit).filter(Boolean)));

  // Filter submissions dynamically matching emitting dept & workflow status
  const filteredSubmissions = submissions.filter(s => {
    // Hide drafts and forms waiting on supervisor (not ready for manager)
    if (s.status === 'draft' || s.status === 'sent_to_supervisor') return false;

    // Filter by Emitting Unit/Department
    if (unitFilter !== 'all' && s.unit !== unitFilter) return false;

    // Filter by Status: pending manager review vs approved/forwarded
    if (statusFilter === 'pending' && s.status !== 'sent_to_manager') return false;
    if (statusFilter === 'approved' && s.status === 'sent_to_manager') return false;

    return true;
  });

  // Filter submissions waiting for department manager review
  const pendingSubmissions = submissions.filter(
    s => s.status === 'sent_to_manager' && (s.unit === currentUser.unit || currentUser.unit === 'عمومی')
  );

  // Filter submissions of current department/unit
  const deptSubmissions = submissions.filter(
    s => s.unit === currentUser.unit || currentUser.unit === 'عمومی'
  );

  const approvedCount = deptSubmissions.filter(
    s => s.status === 'sent_to_president' || s.status === 'approved_by_president'
  ).length;

  const returnedCount = deptSubmissions.filter(
    s => s.status === 'sent_to_supervisor'
  ).length;

  const totalBoth = approvedCount + returnedCount;
  const approvedPercent = totalBoth > 0 ? (approvedCount / totalBoth) * 100 : 0;
  const returnedPercent = totalBoth > 0 ? (returnedCount / totalBoth) * 100 : 0;

  // Filter recently processed submissions for this unit/department
  const recentlyProcessed = deptSubmissions.filter(
    s => s.status === 'sent_to_president' || 
         s.status === 'approved_by_president' || 
         s.managerApprovedAt !== null ||
         (s.status === 'sent_to_supervisor' && s.supervisorComment?.includes('مدیر دپارتمان'))
  ).reverse();

  const selectedSub = submissions.find(s => s.id === selectedSubId);
  const selectedTemplate = selectedSub ? templates.find(t => t.id === selectedSub.templateId) : null;

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubId) return;
    if (!managerComment.trim()) {
      alert('لطفاً نظر مدیریتی یا دستورات اجرایی خود را وارد کنید.');
      return;
    }
    if (!signature) {
      alert('لطفاً امضای دیجیتال دستی خود را روی بوم (Canvas) ترسیم نمایید.');
      return;
    }

    onApproveByManager(selectedSubId, managerComment, currentUser.name, undefined, signature);
    setSelectedSubId(null);
    setManagerComment('');
    setSignature(null);
    alert('فرم با موفقیت تأیید شد و جهت دستور نهایی به کارتابل رئیس شرکت ارجاع داده شد.');
  };

  const handleReject = () => {
    if (!selectedSubId) return;
    if (confirm('آیا مایلید این فرم را جهت نیاز به بازنگری بیشتر به سرپرست تاییدکننده ارجاع دهید؟')) {
      onRejectByManager(selectedSubId, currentUser.name);
      setSelectedSubId(null);
      setManagerComment('');
      setSignature(null);
      alert('فرم با موفقیت جهت شفاف‌سازی بیشتر به کارتابل سرپرست عودت داده شد.');
    }
  };

  const handleSelectSub = (subId: string) => {
    setSelectedSubId(subId);
    setManagerComment('');
    setSignature(null);
    if (onRecordView) {
      onRecordView(subId, currentUser);
    }
  };

  return (
    <div id="manager-review-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      {/* Sidebar: Submissions under review */}
      <div className="lg:col-span-5 space-y-4">
        {/* Department Statistics Simple Bar Chart Widget */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>وضعیت دپارتمان {currentUser.unit !== 'عمومی' ? currentUser.unit : ''}</span>
            </h4>
            <div className="flex items-center gap-1.5">
              {!isStatsCollapsed && (
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setStatsViewTab('chart')}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                      statsViewTab === 'chart' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    نمودار آماری
                  </button>
                  <button
                    onClick={() => setStatsViewTab('recent')}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                      statsViewTab === 'recent' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    آخرین بررسی‌ها
                  </button>
                </div>
              )}
              <button
                onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={isStatsCollapsed ? "نمایش ویجت" : "پنهان کردن ویجت"}
              >
                {isStatsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isStatsCollapsed && (
            <>
              {statsViewTab === 'chart' ? (
                <div className="space-y-3.5 text-xs py-1">
                  {/* Approved Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        تأیید و ارسال فرادستگاهی:
                      </span>
                      <span className="font-mono font-bold text-emerald-700">{approvedCount} فرم ({totalBoth > 0 ? Math.round(approvedPercent) : 0}٪)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${totalBoth > 0 ? approvedPercent : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Returned Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        عودت داده شده به سرپرست:
                      </span>
                      <span className="font-mono font-bold text-rose-700">{returnedCount} فرم ({totalBoth > 0 ? Math.round(returnedPercent) : 0}٪)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${totalBoth > 0 ? returnedPercent : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {recentlyProcessed.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center py-5">هیچ فرمی اخیراً بررسی نشده است.</p>
                  ) : (
                    recentlyProcessed.slice(0, 5).map(s => {
                      const isApproved = s.status === 'sent_to_president' || s.status === 'approved_by_president' || s.managerApprovedAt !== null;
                      return (
                        <div key={s.id} className="p-2 border border-slate-100 rounded-lg text-xs flex flex-col gap-1 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700 truncate max-w-[170px]">{s.templateTitle}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isApproved ? 'تأیید و ارسال' : 'عودت داده شده'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
                            <span>متقاضی: {s.staffName} ({s.unit})</span>
                            <span className="font-semibold text-slate-500 text-[10px]">{toPersianDate(s.managerApprovedAt || s.createdAt)}</span>
                          </div>
                          {s.managerComment && (
                            <p className="text-[9px] text-slate-500 line-clamp-1 italic bg-white px-1.5 py-0.5 rounded border border-slate-100 mt-0.5">💬 {s.managerComment}</p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400">
                <span>کل اقدامات بررسی شده: {totalBoth} مورد</span>
                <span>بایگانی دیجیتال پویان</span>
              </div>
            </>
          )}
        </div>

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
                <option value="pending">در انتظار مدیر</option>
                <option value="approved">تأیید شدگان / مراحل بعدی</option>
              </select>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-bold text-slate-800 flex items-center justify-between gap-1 leading-none pt-2">
          <span className="flex items-center gap-1.5">
            <Newspaper className="w-4 h-4 text-emerald-500" />
            کارتابل تائید مدیران دپارتمان ({filteredSubmissions.length})
          </span>
        </h3>

        <div className="space-y-3">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-none" />
              <p className="text-xs font-semibold text-slate-705">کارپوشه کاملا خالی است!</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                هیچ فرمی با فیلترهای کنونی در کارتابل مدیر مطابقت ندارد.
              </p>
            </div>
          ) : (
            filteredSubmissions.map(sub => {
              const overdueInfo = getOverdueInfo(sub, 'manager', deadlines);
              const isPending = sub.status === 'sent_to_manager';
              const showOverdueAlert = isPending && overdueInfo.isOverdue;

              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSub(sub.id)}
                  className={`w-full text-right bg-white border rounded-xl p-4 transition-all duration-200 flex flex-col gap-2 cursor-pointer ${
                    selectedSubId === sub.id
                      ? showOverdueAlert
                        ? 'border-rose-500 ring-2 ring-rose-505/20 bg-rose-50/10'
                        : 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10'
                      : showOverdueAlert
                      ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-455'
                      : 'border-slate-200 hover:border-slate-300'
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
                        <span className="text-[8px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-emerald-500 animate-none" />
                          <span>در انتظار تایید شما</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[8px] bg-indigo-50 text-indigo-800 font-bold px-1.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1 select-none">
                        <FileCheck className="w-2.5 h-2.5 text-indigo-500" />
                        <span>منظور شد (ارسال به رئیس)</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mb-0.5 line-clamp-1">{sub.templateTitle}</h4>
                  
                  <div className="text-[10px] text-slate-505 space-y-0.5 mt-1 pt-1.5 border-t border-slate-100/60 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <p>کارشناس دپارتمان: <span className="text-slate-700 font-medium">{sub.staffName} ({sub.unit})</span></p>
                      <p className="text-slate-400">تأییدیه اولیه: <span className="text-indigo-600 font-medium">{sub.supervisorName}</span></p>
                    </div>

                    {isPending && (
                      <div className={`text-[9.5px] font-semibold ${showOverdueAlert ? 'text-rose-600 font-bold animate-pulse' : 'text-slate-550'}`}>
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
              {/* SLA Warning Banner inside detail view */}
              {(() => {
                const overdueInfo = getOverdueInfo(selectedSub, 'manager', deadlines);
                const isPending = selectedSub.status === 'sent_to_manager';
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
                    {selectedSub.supervisorApprovedAt && (
                      <span className="text-[10px] bg-white/70 dark:bg-slate-900/60 px-2 py-0.5 rounded font-mono">تایید سرپرستی: {selectedSub.supervisorApprovedAt}</span>
                    )}
                  </div>
                );
              })()}

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
              {selectedSub.status === 'sent_to_manager' ? (
                <form onSubmit={handleApprove} className="space-y-3 pt-3 border-t border-slate-100 animate-fadeIn">
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

                  {/* Manual signature drawing canvas */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      🖋️ ترسیم امضای دیجیتال دستی جهت الصاق به سند اداری:
                    </label>
                    <SignatureCanvas 
                      onSave={setSignature} 
                      placeholder="امضای خود را با استفاده از موس یا لمس صفحه در فضای زیر ترسیم کنید..." 
                    />
                  </div>

                  {/* Submit actions buttons */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReject}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                      ارجاع به سرپرست جهت رفع ابهام
                    </button>

                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2 text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4" />
                      تائید و ارسال فرادستگاهی به رئیس کل
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>دستور مدیریتی الصاق شده به پورتال:</span>
                  </div>
                  <p className="text-xs text-slate-700 italic bg-white p-3 border border-slate-100 rounded-lg">
                    {selectedSub.managerComment || 'بدون یادداشت'}
                  </p>
                  {selectedSub.managerSignature && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[11px] font-bold text-slate-500">امضای دیجیتال مدیر دپارتمان:</span>
                      <div className="bg-white border border-slate-200 rounded-lg p-1 px-2.5 inline-block shadow-2xs">
                        <img 
                          src={selectedSub.managerSignature} 
                          alt="امضای مدیر" 
                          className="h-10 object-contain block mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Event Logs Trace Timeline */}
              <SubmissionHistoryLog submission={selectedSub} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
