import React, { useState, useEffect } from 'react';
import { User, FormTemplate, FormSubmission } from './types';
import { INITIAL_USERS, INITIAL_TEMPLATES, INITIAL_SUBMISSIONS } from './mockData';
import RoleSelector from './components/RoleSelector';
import AdminPanel from './components/AdminPanel';
import StaffFormSubmission from './components/StaffFormSubmission';
import SupervisorReview from './components/SupervisorReview';
import ManagerReview from './components/ManagerReview';
import PresidentReview from './components/PresidentReview';
import PhpSourceCodeGuide from './components/PhpSourceCodeGuide';
import { LayoutDashboard, Award, Settings, CheckSquare, Shield, HelpCircle, Landmark } from 'lucide-react';

export default function App() {
  // Initialize States from localStorage if exists, else defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('wf_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [templates, setTemplates] = useState<FormTemplate[]>(() => {
    const saved = localStorage.getItem('wf_templates');
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem('wf_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  // Simulation current logged in user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find(u => u.role === 'staff') || users[0];
  });

  // Global Workspace Visual Active View
  // "workflow" simulates the live role interface, "php-code" shows the developer/MySQL manual.
  const [activeNavbarTab, setActiveNavbarTab] = useState<'workflow' | 'php-code'>('workflow');

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('wf_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('wf_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('wf_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Actions handlers
  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleAddTemplate = (newTmpl: FormTemplate) => {
    setTemplates(prev => [newTmpl, ...prev]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateSubmission = (newSub: FormSubmission) => {
    setSubmissions(prev => [newSub, ...prev]);
  };

  const handleDeleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const handleApproveBySupervisor = (id: string, comment: string, supervisorName: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'sent_to_manager',
          supervisorComment: comment,
          supervisorName: supervisorName,
          supervisorApprovedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return s;
    }));
  };

  const handleRejectBySupervisor = (id: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'draft', // Sent back to drafter's draft status
          supervisorComment: null,
          supervisorApprovedAt: null,
          supervisorName: null
        };
      }
      return s;
    }));
  };

  const handleApproveByManager = (id: string, comment: string, managerName: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'sent_to_president',
          managerComment: comment,
          managerName: managerName,
          managerApprovedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return s;
    }));
  };

  const handleRejectByManager = (id: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'sent_to_supervisor', // Reject back to supervisor level
          managerComment: null,
          managerApprovedAt: null,
          managerName: null,
          supervisorComment: 'نیاز به شفاف سازی مجدد توسط مدیر دپارتمان عودت داده شد.',
          supervisorApprovedAt: null
        };
      }
      return s;
    }));
  };

  const handleApproveByPresident = (id: string, comment: string, presidentName: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'approved_by_president',
          presidentComment: comment,
          presidentName: presidentName,
          presidentApprovedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return s;
    }));
  };

  // Preset default databases reset
  const handleResetData = () => {
    if (confirm('آیا مایلید تمام داده‌های فرضی، فرم‌های تست و کاربران را به حالت اولیه کارخانه بازنشانی کنید؟')) {
      localStorage.removeItem('wf_users');
      localStorage.removeItem('wf_templates');
      localStorage.removeItem('wf_submissions');
      setUsers(INITIAL_USERS);
      setTemplates(INITIAL_TEMPLATES);
      setSubmissions(INITIAL_SUBMISSIONS);
      setCurrentUser(INITIAL_USERS.find(u => u.role === 'staff') || INITIAL_USERS[0]);
      alert('کل اطلاعات با موفقیت ریست شد.');
    }
  };

  // Calculated overall statistics
  const countPendingSupervisor = submissions.filter(s => s.status === 'sent_to_supervisor').length;
  const countPendingManager = submissions.filter(s => s.status === 'sent_to_manager').length;
  const countPendingPresident = submissions.filter(s => s.status === 'sent_to_president').length;
  const countApproved = submissions.filter(s => s.status === 'approved_by_president').length;

  return (
    <div id="app-root" className="min-h-screen bg-slate-100 text-slate-900 pb-12 font-sans" dir="rtl">
      
      {/* Top Main Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-xl shadow">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100">سامانه محلی مدیریت گردش کار کارمندان</h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">پورتال اختصاصی تحت شبکه سازمان</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">شبیه‌ساز گردش اطلاعات بین ۲۰۰ کارمند، ۲۰ سرپرست، ۱۰ مدیر دپارتمان و رئیس شرکت</p>
            </div>
          </div>

          {/* Quick Tab control */}
          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button
              id="workflow-simulator-tab"
              onClick={() => setActiveNavbarTab('workflow')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeNavbarTab === 'workflow'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span> شبیه‌ساز گردش فرم‌ها</span>
            </button>

            <button
              id="php-codeinstall-tab"
              onClick={() => setActiveNavbarTab('php-code')}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeNavbarTab === 'php-code'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>کدهای کامل PHP دیتابیس</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        
        {/* Render interactive workflow simulator view */}
        {activeNavbarTab === 'workflow' && (
          <div className="space-y-6">
            
            {/* Top Organizational role switcher */}
            <RoleSelector
              users={users}
              currentUser={currentUser}
              onUserChange={(selectedUser) => setCurrentUser(selectedUser)}
            />

            {/* Simulated Live Overall Dashboard Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">فرم‌های در کارتابل سرپرست</p>
                  <p className="text-lg font-bold text-indigo-700 mt-1">{countPendingSupervisor} فرم جاری</p>
                </div>
                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-500">
                  <CheckSquare className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">فرم‌های در کارتابل مدیر کل</p>
                  <p className="text-lg font-bold text-emerald-700 mt-1">{countPendingManager} فرم جاری</p>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-500">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">فرم‌های نهایی در کارتابل رئیس</p>
                  <p className="text-lg font-bold text-amber-700 mt-1">{countPendingPresident} فرم جاری</p>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg text-amber-500">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400">مجموع اسناد نهایی موافقت شده</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{countApproved} فرم امضاء شده</p>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600">
                  <CheckSquare className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Live active Sim-role panel widget rendering */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 text-xs font-bold rounded-md bg-slate-900 text-white">
                    {currentUser.role === 'admin' ? 'ادمین' :
                     currentUser.role === 'staff' ? 'کارشناس' :
                     currentUser.role === 'supervisor' ? 'سرپرست' :
                     currentUser.role === 'manager' ? 'مدیر' : 'رئیس کل'}
                  </span>
                  <h3 className="text-xs font-bold text-slate-700">
                    نمای اختصاصی: {currentUser.name} ({currentUser.unit})
                  </h3>
                </div>

                <button
                  onClick={handleResetData}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  بازنشانی کل پورتال به مقادیر پیش‌فرض کارخانه
                </button>
              </div>

              <div className="transition-all duration-300">
                {currentUser.role === 'admin' && (
                  <AdminPanel
                    users={users}
                    templates={templates}
                    onAddUser={handleAddUser}
                    onAddTemplate={handleAddTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                  />
                )}

                {currentUser.role === 'staff' && (
                  <StaffFormSubmission
                    currentUser={currentUser}
                    templates={templates}
                    submissions={submissions}
                    onCreateSubmission={handleCreateSubmission}
                    onDeleteSubmission={handleDeleteSubmission}
                  />
                )}

                {currentUser.role === 'supervisor' && (
                  <SupervisorReview
                    currentUser={currentUser}
                    submissions={submissions}
                    templates={templates}
                    onApproveBySupervisor={handleApproveBySupervisor}
                    onRejectBySupervisor={handleRejectBySupervisor}
                  />
                )}

                {currentUser.role === 'manager' && (
                  <ManagerReview
                    currentUser={currentUser}
                    submissions={submissions}
                    templates={templates}
                    onApproveByManager={handleApproveByManager}
                    onRejectByManager={handleRejectByManager}
                  />
                )}

                {currentUser.role === 'president' && (
                  <PresidentReview
                    currentUser={currentUser}
                    submissions={submissions}
                    templates={templates}
                    onApproveByPresident={handleApproveByPresident}
                  />
                )}
              </div>
            </div>

          </div>
        )}

        {/* Developer Tab containing total PHP codes for local setups */}
        {activeNavbarTab === 'php-code' && (
          <PhpSourceCodeGuide />
        )}

        {/* Workspace Quick informational alert */}
        <div className="mt-8 bg-blue-50 border border-blue-200 text-blue-800 text-xs p-5 rounded-xl flex items-start gap-3 leading-relaxed print:hidden">
          <Settings className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <span className="font-bold block mb-1 text-blue-900">💡 راهنمای کاربری برای امتحان دمو:</span>
            شما می‌توانید به عنوان <strong>کارشناس (علی حسینی)</strong> یک فرم ثبت کرده و پیام "موفقیت" آن را مشاهده کنید. سپس به آسانی از نوارهای شبیه‌ساز بالا، کاربر فرضی را به <strong>سرپرست کارگاه (مهندس رضایی)</strong> تغییر دهید تا آن فرم تحت بررسی ظاهر شود، نظر نوشته و دکمه تایید بزنید. به همین ترتیب با ارجاع به <strong>مدیر دپارتمان (دکتر علوی)</strong> و در نهایت <strong>رئیس شرکت (آقای رستمی)</strong> کل جریان تاییدات سلسله مراتبی و موافقت‌ها را جلو ببرید. پس از امضای ریاست قادر خواهید بود سند اداری را با فاکتورهای مرتب به عنوان فرمت PDF رسمی به چاپ برسانید!
          </div>
        </div>

      </main>

    </div>
  );
}
