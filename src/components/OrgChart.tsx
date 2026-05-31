import React, { useState } from 'react';
import { Users, Award, Shield, Briefcase, ChevronDown, ChevronUp, Network, CheckCircle, ArrowDown } from 'lucide-react';

interface OrgNodeProps {
  title: string;
  name: string;
  role: string;
  unit: string;
  description: string;
  colorClass: string;
  borderColor: string;
  badgeColor: string;
  flowArrow?: boolean;
}

function OrgNode({ title, name, role, unit, description, colorClass, borderColor, badgeColor, flowArrow = false }: OrgNodeProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col items-center">
      <div className={`w-full max-w-sm bg-white dark:bg-slate-900 border-2 ${borderColor} rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200`}>
        {/* Color stripe banner */}
        <div className={`h-2 ${colorClass}`} />
        
        <div className="p-4 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {title}
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
              {unit}
            </span>
          </div>

          {/* Name & Title */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{name}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{role}</p>
          </div>

          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-[9px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 transition-colors pt-1 border-t border-slate-100 dark:border-slate-800"
          >
            <span>شرح تایید صلاحیت و جریان گزارش</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {isOpen && (
            <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 font-sans">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {flowArrow && (
        <div className="flex flex-col items-center my-3">
          {/* Connective Line */}
          <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
          <ArrowDown className="w-4 h-4 text-slate-400 dark:text-slate-500 -mt-1 animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default function OrgChart() {
  const [activeUnitTab, setActiveUnitTab] = useState<'all' | 'tech' | 'contracts' | 'dcc'>('all');

  return (
    <div id="org-chart-root" className="space-y-6" dir="rtl">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/15 rounded-xl text-indigo-400">
            <Network className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">چارت هوشمند و ساختار سلسله مراتب سازمانی</h1>
            <p className="text-xs text-slate-400 mt-1">نمودار استاندارد ارجاع اسناد اداری، تاییدات سلسله‌مراتبی و مسیر جریان گزارش مکتوب پرسنل</p>
          </div>
        </div>
        
        {/* Dynamic Legend */}
        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            سطح رئیس عالی
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            سطح مدیر دپارتمان
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            سطح سرپرست کارگاه
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            سطح کارشناس فنی
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl gap-2 border border-slate-200 dark:border-slate-800 max-w-2xl">
        <button
          onClick={() => setActiveUnitTab('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeUnitTab === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          کل ساختار زنجیره تاییدات
        </button>
        <button
          onClick={() => setActiveUnitTab('tech')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeUnitTab === 'tech'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          دپارتمان فنی و مهندسی
        </button>
        <button
          onClick={() => setActiveUnitTab('contracts')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeUnitTab === 'contracts'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          دپارتمان امور قراردادها
        </button>
        <button
          onClick={() => setActiveUnitTab('dcc')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeUnitTab === 'dcc'
              ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          دپارتمان کنترل مدارک (Dcc)
        </button>
      </div>

      {/* Organizational Tree Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xs overflow-x-auto min-h-[500px] flex flex-col items-center">
        
        {/* Level 1: CEO / President (Always shows as root) */}
        <OrgNode
          title="سطح ۱: ریاست عالی سازمان"
          name="جناب آقای مهندس رستمی"
          role="ریاست کل و امضاکننده نهایی"
          unit="عمومی سازمان"
          description="بررسی نهایی گزارشات کلان دپارتمان‌ها و صدور دستور پرداخت کارگاهی، ابلاغ بودجه یا بایگانی قطعی اسناد."
          colorClass="bg-red-500"
          borderColor="border-red-500/40"
          badgeColor="bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
          flowArrow={true}
        />

        {/* Level 2: Managers (Conditional Row depending on active tab) */}
        <div className="w-full flex flex-col items-center">
          
          {/* Horizontal Connector Line for managers */}
          {activeUnitTab === 'all' && (
            <div className="hidden md:block w-3/4 h-0.5 bg-slate-200 dark:bg-slate-800 -mt-3 mb-6" />
          )}

          <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-center items-start w-full">
            
            {/* Manager Module 1: Tech */}
            {(activeUnitTab === 'all' || activeUnitTab === 'tech') && (
              <div className="flex-1 flex flex-col items-center space-y-4 w-full">
                <OrgNode
                  title="سطح ۲: مدیریت ارشد بخش"
                  name="دکتر علوی"
                  role="مدیر ارشد دپارتمان فنی و مهندسی"
                  unit="واحد فنی و مهندسی"
                  description="تحلیل عملکرد، بررسی گزارشات کالیبراسیون و پیشرفت فونداسیون، ارجاع مستقیم تاییدیه مکتوب به ریاست."
                  colorClass="bg-emerald-500"
                  borderColor="border-emerald-500/30"
                  badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400"
                  flowArrow={true}
                />
                
                {/* Supervisor Node */}
                <OrgNode
                  title="سطح ۳: سرپرست کنترل اداری"
                  name="مهندس رضایی"
                  role="سرپرست کارگاه و دپارتمان فنی"
                  unit="واحد فنی و مهندسی"
                  description="مشاهده صحت کارکرد لودسل‌ها و تجهیزات، ثبت نظرات اولیه و ارسال به مدیر دپارتمان."
                  colorClass="bg-amber-500"
                  borderColor="border-amber-500/30"
                  badgeColor="bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400"
                  flowArrow={true}
                />

                {/* Staff List */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 w-full max-w-sm space-y-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-1.5 justify-between">
                    <span>سطح ۴: پرسنل تکمیل‌کننده گزارش</span>
                    <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded text-[9px]">فنی</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-200">علی حسینی</p>
                      <p className="text-[10px] text-slate-400">کارشناس ارشد انرژی و پایپینگ</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-200">نرگس محمدی</p>
                      <p className="text-[10px] text-slate-400">کارشناس عمران و ایمنی سازه</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manager Module 2: Contracts */}
            {(activeUnitTab === 'all' || activeUnitTab === 'contracts') && (
              <div className="flex-1 flex flex-col items-center space-y-4 w-full mt-8 md:mt-0">
                <OrgNode
                  title="سطح ۲: مدیریت ارشد بخش"
                  name="آقای دکتر خسروی"
                  role="مدیر کل امور حقوقی و قراردادها"
                  unit="امور قراردادها"
                  description="بازنگری اسناد تسویه حساب پیمانکار و بررسی جریمه تاخیرات، ارسال ارزیابی الحاقیه به ریاست کل."
                  colorClass="bg-emerald-500"
                  borderColor="border-emerald-500/30"
                  badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400"
                  flowArrow={true}
                />
                
                {/* Supervisor Node */}
                <OrgNode
                  title="سطح ۳: سرپرست کنترل اداری"
                  name="آقای عباسی"
                  role="سرپرست امور قراردادها"
                  unit="امور قراردادها"
                  description="همگام‌سازی مبالغ الحاقیه‌ها و تضامین حسن تعهدات کارگاهی، ارجاع تایید شده به مدیر."
                  colorClass="bg-amber-500"
                  borderColor="border-amber-500/30"
                  badgeColor="bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400"
                  flowArrow={true}
                />

                {/* Staff List */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 w-full max-w-sm space-y-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-1.5 justify-between">
                    <span>سطح ۴: پرسنل تکمیل‌کننده گزارش</span>
                    <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded text-[9px]">قراردادها</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-200">مرتضی کرمی</p>
                      <p className="text-[10px] text-slate-400">کارشناس ارشد حقوقی قراردادها</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-200">شیوا قاسمی</p>
                      <p className="text-[10px] text-slate-400">کارشناس ارزیابی مالی پیمان</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manager Module 3: DCC */}
            {(activeUnitTab === 'all' || activeUnitTab === 'dcc') && (
              <div className="flex-1 flex flex-col items-center space-y-4 w-full mt-8 md:mt-0">
                <OrgNode
                  title="سطح ۲: مدیریت ارشد بخش"
                  name="خانم مهندس سلیمی"
                  role="مدیر کل کنترل اسناد (Dcc)"
                  unit="کنترل اسناد (Dcc)"
                  description="کدگذاری و یکپارچه‌سازی اسناد فنی و نقشه‌ها پیش از مهر و امضای نهایی ابلاغ به پیمانکار."
                  colorClass="bg-emerald-500"
                  borderColor="border-emerald-500/30"
                  badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400"
                  flowArrow={true}
                />
                
                {/* Supervisor Node */}
                <OrgNode
                  title="سطح ۳: سرپرست کنترل اداری"
                  name="آقای کاظمی"
                  role="سرپرست کنترل اسناد Dcc"
                  unit="کنترل اسناد (Dcc)"
                  description="بازبینی کدهای ترانسمیتال و شمارش نقشه‌های ارسالی مهندسین مشاور، تایید و ارجاع."
                  colorClass="bg-amber-500"
                  borderColor="border-amber-500/30"
                  badgeColor="bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400"
                  flowArrow={true}
                />

                {/* Staff List */}
                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 w-full max-w-sm space-y-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-1.5 justify-between">
                    <span>سطح ۴: پرسنل تکمیل‌کننده گزارش</span>
                    <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[9px]">Dcc</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-200">پیمان حسنی</p>
                      <p className="text-[10px] text-slate-400">کارشناس آرشیو فنی اسناد</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-200">زهرا هاشمی</p>
                      <p className="text-[10px] text-slate-400">کارشناس تطابق مستندسازی</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* System Administrator Unit Node */}
          {activeUnitTab === 'all' && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 w-full flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold mb-3">کنترل مستقل شبکه فناوری اطلاعات سازمان (IT/Admin)</span>
              <div className="flex items-center gap-3 bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-4 border border-slate-800 shadow max-w-sm text-right">
                <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">مهندس اکبری (ادمین شبکه و فناوری اطلاعات)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">مسئول دیتابیس، ساخت پروژه‌های نوین، عزل و نصب پرسنل، و صدور مجوز فرم‌سازها</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Corporate Process Flow Note */}
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-950/70 p-4 rounded-xl flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <div className="text-xs text-indigo-900 dark:text-indigo-300 leading-relaxed font-sans">
          <span className="font-bold block mb-1">مکانیزم امضای دیجیتال مکتوب فیزیکی الکترونیک:</span>
          گزارشات تکمیل شده در سطح ۴ (کارشناس) بدواً با مهر زمان وارد کارتابل سرپرست سطح ۳ می‌شود. پس از تایید سرپرست، سند اتوماتیک قفل گردیده و به سطح ۲ (مدیر دپارتمان) تحویل می‌شود. با امضای مدیر دپارتمان، درخواست نهایتاً در پورتال ریاست سطح ۱ بارگذاری می‌گردد. هرگونه درخواست امضا شده توسط رئیس بلافاصله در بانک اسناد مصوب سازمان ثبت می‌شود.
        </div>
      </div>
      
    </div>
  );
}
