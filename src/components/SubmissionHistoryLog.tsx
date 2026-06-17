import React from 'react';
import { FormSubmission, User } from '../types';
import { toPersianDate } from '../utils/dateConverter';
import { Clock, Eye, CheckCircle2, FileUp, ShieldAlert, CornerDownRight, MessageSquare, Reply } from 'lucide-react';

interface SubmissionHistoryLogProps {
  submission: FormSubmission;
}

export default function SubmissionHistoryLog({ submission }: SubmissionHistoryLogProps) {
  // Let's build a unified list of events.
  // First, we read from the actual logs array if present:
  const actualLogs = submission.logs || [];

  // To be super robust and backward-compatible for pre-existing records (seeding data from mockData),
  // we can also auto-construct fallback events if actualLogs is empty,
  // then merge and sort them!
  const computedEvents: {
    id: string;
    userName: string;
    userRole: string;
    action: 'create' | 'view' | 'approve' | 'edit_or_update' | 'reject';
    actionLabel: string;
    timestamp: string;
    comment?: string | null;
  }[] = [...actualLogs];

  // If there are no actual logs, or we want to make sure approvals are accounted for even if not logged:
  if (actualLogs.length === 0) {
    // 1. Creation
    computedEvents.push({
      id: 'fallback-create',
      userName: submission.staffName,
      userRole: 'staff',
      action: 'create',
      actionLabel: 'ثبت اولیه فرم و ارسال جهت تایید',
      timestamp: submission.createdAt,
    });

    // 2. Supervisor Approval
    if (submission.supervisorApprovedAt && submission.supervisorName) {
      computedEvents.push({
        id: 'fallback-sup',
        userName: submission.supervisorName,
        userRole: 'supervisor',
        action: 'approve',
        actionLabel: 'تایید و ارجاع توسط سرپرست کارگاه',
        timestamp: submission.supervisorApprovedAt,
        comment: submission.supervisorComment,
      });
    }

    // 3. Manager Approval
    if (submission.managerApprovedAt && submission.managerName) {
      computedEvents.push({
        id: 'fallback-mgr',
        userName: submission.managerName,
        userRole: 'manager',
        action: 'approve',
        actionLabel: 'امضا و تایید مدیر ارشد دپارتمان',
        timestamp: submission.managerApprovedAt,
        comment: submission.managerComment,
      });
    }

    // 4. President Approval
    if (submission.presidentApprovedAt && submission.presidentName) {
      computedEvents.push({
        id: 'fallback-pres',
        userName: submission.presidentName,
        userRole: 'president',
        action: 'approve',
        actionLabel: 'توشیح عالی و ثبت قطعی توسط رئیس شرکت',
        timestamp: submission.presidentApprovedAt,
        comment: submission.presidentComment,
      });
    }
  }

  // Sort events by timestamp ascending or descending.
  // Decreasing order is great for logs so the newest updates are on top,
  // but a timeline normally flows chronological (oldest to newest). Let's do chronological!
  const sortedEvents = [...computedEvents].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  // Role translation helper
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'مدیر سیستم', color: 'bg-rose-150 text-rose-800 border-rose-200' };
      case 'president':
        return { label: 'رئیس عالی شرکت', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'manager':
        return { label: 'مدیر ارشد دپارتمان', color: 'bg-indigo-100 text-indigo-900 border-indigo-200' };
      case 'supervisor':
        return { label: 'سرپرست کارگاه', color: 'bg-emerald-100 text-emerald-850 border-emerald-250' };
      case 'staff':
      default:
        return { label: 'کارشناس فنی', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <FileUp className="w-4 h-4 text-indigo-500" />;
      case 'view':
        return <Eye className="w-4 h-4 text-slate-500" />;
      case 'approve':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'reject':
        return <Reply className="w-4 h-4 text-rose-500" />;
      case 'edit_or_update':
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div id={`history-log-${submission.id}`} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mt-6 font-sans">
      <div className="flex items-center gap-1.5 mb-4 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <Clock className="w-4 h-4 text-indigo-500 animate-spin-slow" />
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
          سامانه رهگیری و لاگ رخدادهای گردش کار (شفافیت فرآیند)
        </h4>
      </div>

      <div className="relative border-r-2 border-slate-200 dark:border-slate-800 mr-3 pr-5 space-y-6">
        {sortedEvents.map((event, index) => {
          const badge = getRoleBadge(event.userRole);
          return (
            <div key={event.id || index} className="relative group">
              {/* Timeline Bullet Anchor */}
              <span className={`absolute -right-[29px] top-0.5 rounded-full p-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110`}>
                {getActionIcon(event.action)}
              </span>

              {/* Event Line Content */}
              <div>
                <div id={`event-row-${event.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {event.userName}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {event.actionLabel}
                    </span>
                  </div>
                  
                  {/* Timestamp in Persian readable shamsi format */}
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 select-none whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{toPersianDate(event.timestamp)}</span>
                    <span className="text-[9px] font-mono opacity-80">({event.timestamp.includes(' ') ? event.timestamp.split(' ')[1] : event.timestamp.split('T')[1]?.slice(0, 5) || ''})</span>
                  </div>
                </div>

                {/* Sub comment or observation attached to event */}
                {event.comment && (
                  <div className="mt-1.5 text-[11px] text-slate-650 dark:text-slate-400 bg-white dark:bg-slate-900/85 p-3.5 border border-slate-150 dark:border-slate-800/80 rounded-lg shadow-2xs italic flex items-start gap-1">
                    <span className="text-amber-500 font-bold pr-0.5 font-sans">💬 پیوست یادداشت:</span>
                    <span>{event.comment}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
