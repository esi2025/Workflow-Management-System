import React, { useState, useEffect } from 'react';
import { User, FormTemplate, FormSubmission, WorkflowDeadlines } from './types';
import { INITIAL_USERS, INITIAL_TEMPLATES, INITIAL_SUBMISSIONS } from './mockData';
import RoleSelector from './components/RoleSelector';
import AdminPanel from './components/AdminPanel';
import StaffFormSubmission from './components/StaffFormSubmission';
import SupervisorReview from './components/SupervisorReview';
import ManagerReview from './components/ManagerReview';
import PresidentReview from './components/PresidentReview';
import OrgChart from './components/OrgChart';
import PhpSourceCodeGuide from './components/PhpSourceCodeGuide';
import Login from './components/Login';
import { LayoutDashboard, Award, Settings, CheckSquare, Shield, HelpCircle, Landmark, Sun, Moon, Network, LogOut } from 'lucide-react';

export default function App() {
  // Initialize States from localStorage if exists, else defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('wf_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [templates, setTemplates] = useState<FormTemplate[]>(() => {
    const saved = localStorage.getItem('wf_templates');
    const parsed: FormTemplate[] = saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
    // Guarantee correct localized field labels regardless of browser storage
    return parsed.map(t => {
      if (t.id === 'tech_work') {
        return {
          ...t,
          fields: t.fields.map(f => {
            if (f.id === 'tech_summary') {
              return { ...f, label: 'توضیحات اقدامات انجام شده / خلاصه فعالیت برنامه ریزی شده برای روز کاری آینده.' };
            }
            if (f.id === 'safety_check') {
              return { ...f, label: 'تأیید رعایت کامل پروتکل‌ها و الزامات سازمانی کارگاه' };
            }
            return f;
          })
        };
      }
      return t;
    });
  });

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem('wf_submissions');
    const parsed: FormSubmission[] = saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    // Guarantee correct localized template titles
    return parsed.map(s => {
      if (s.templateId === 'tech_work') {
        return {
          ...s,
          templateTitle: 'فرم گزارش فنی و پیشرفت فیزیکی کارگاه'
        };
      }
      return s;
    });
  });

  // Dynamic departments state
  const [departments, setDepartments] = useState<string[]>(() => {
    const saved = localStorage.getItem('wf_departments');
    return saved ? JSON.parse(saved) : ['فنی و مهندسی', 'امور قراردادها', 'کنترل اسناد (Dcc)'];
  });

  // Dark mode status state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('wf_dark_mode') === 'true';
  });

  // Simulation current logged in user (starts at null to force login page first)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Global Workspace Visual Active View
  // "workflow" simulates the live role interface, "org-chart" shows the organizational tree, "php-code" shows the developer/MySQL manual.
  const [activeNavbarTab, setActiveNavbarTab] = useState<'workflow' | 'org-chart' | 'php-code'>('workflow');

  // Company logo state (base64 or image url)
  const [companyLogo, setCompanyLogo] = useState<string | null>(() => {
    return localStorage.getItem('wf_company_logo');
  });

  // traffic statistical views
  const [totalViews, setTotalViews] = useState<number>(() => {
    const saved = localStorage.getItem('wf_total_views');
    return saved ? parseInt(saved, 10) : 1248;
  });

  const [dailyViews, setDailyViews] = useState<number>(() => {
    const saved = localStorage.getItem('wf_daily_views');
    return saved ? parseInt(saved, 10) : 145;
  });

  // project templates custom list
  const [projects, setProjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('wf_projects');
    return saved ? JSON.parse(saved) : ['پروژه سد هراز', 'بیمارستان بهشهر', 'برج پایتخت', 'تصفیه خانه ارومیه', 'نیروگاه قشم'];
  });

  // Workflow SLAs / deadlines configuration state
  const [deadlines, setDeadlines] = useState<WorkflowDeadlines>(() => {
    const saved = localStorage.getItem('wf_deadlines');
    return saved ? JSON.parse(saved) : {
      supervisor: { value: 24, unit: 'h' },
      manager: { value: 48, unit: 'h' },
      president: { value: 72, unit: 'h' }
    };
  });

  useEffect(() => {
    localStorage.setItem('wf_deadlines', JSON.stringify(deadlines));
  }, [deadlines]);

  // Traffic increment simulation on mount
  useEffect(() => {
    const newTotal = totalViews + 1;
    const newDaily = dailyViews + 1;
    setTotalViews(newTotal);
    setDailyViews(newDaily);
    localStorage.setItem('wf_total_views', String(newTotal));
    localStorage.setItem('wf_daily_views', String(newDaily));
  }, []);

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

  useEffect(() => {
    localStorage.setItem('wf_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('wf_projects', JSON.stringify(projects));
  }, [projects]);

  // Protect php-code tab: if user ceases to be an admin, redirect them out of the PHP manual tab.
  useEffect(() => {
    if (currentUser?.role !== 'admin' && activeNavbarTab === 'php-code') {
      setActiveNavbarTab('workflow');
    }
  }, [currentUser, activeNavbarTab]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wf_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wf_dark_mode', 'false');
    }
  }, [darkMode]);

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

  const handleAddDepartment = (name: string) => {
    if (!departments.includes(name)) {
      setDepartments(prev => [...prev, name]);
    }
  };

  const handleDeleteDepartment = (name: string) => {
    setDepartments(prev => prev.filter(d => d !== name));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    // If deleted user was active user, reset to first administrator
    if (currentUser.id === id) {
      setCurrentUser(INITIAL_USERS[0]);
    }
  };

  const handleAddProject = (name: string) => {
    if (!projects.includes(name)) {
      setProjects(prev => [...prev, name]);
    }
  };

  const handleDeleteProject = (name: string) => {
    setProjects(prev => prev.filter(p => p !== name));
  };

  const handleLogoChange = (logoBase64: string | null) => {
    setCompanyLogo(logoBase64);
    if (logoBase64) {
      localStorage.setItem('wf_company_logo', logoBase64);
    } else {
      localStorage.removeItem('wf_company_logo');
    }
  };

  const handleRecordViewSubmission = (id: string, viewer: User) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        const logs = s.logs || [];
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        
        // Prevent duplicate sequential view logs by the same user to keep logs tidy
        const lastLog = logs[logs.length - 1];
        if (lastLog && lastLog.action === 'view' && lastLog.userName === viewer.name) {
          return s; 
        }

        const newLogEntry = {
          id: `log_${Date.now()}_view_${Math.random().toString(36).substr(2, 4)}`,
          userName: viewer.name,
          userRole: viewer.role,
          action: 'view' as const,
          actionLabel: 'مشاهده و بررسی جزئیات فرم',
          timestamp: nowStr,
        };

        return {
          ...s,
          logs: [...logs, newLogEntry]
        };
      }
      return s;
    }));
  };

  const handleCreateSubmission = (newSub: FormSubmission) => {
    const freshLog = {
      id: `log_${Date.now()}_create`,
      userName: newSub.staffName,
      userRole: 'staff',
      action: 'create' as const,
      actionLabel: 'ثبت اولیه فرم و ارسال جهت تایید',
      timestamp: newSub.createdAt,
    };
    const subWithLog = {
      ...newSub,
      logs: [freshLog]
    };
    setSubmissions(prev => [subWithLog, ...prev]);
  };

  const handleDeleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const handleApproveBySupervisor = (id: string, comment: string, supervisorName: string, rating?: number) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const approveLog = {
          id: `log_${Date.now()}_sup_approve`,
          userName: supervisorName,
          userRole: 'supervisor',
          action: 'approve' as const,
          actionLabel: 'بررسی، تایید و ارجاع توسط سرپرست کارگاه',
          timestamp: nowStr,
          comment: comment
        };
        const currentLogs = s.logs || [];
        return {
          ...s,
          status: 'sent_to_manager',
          supervisorComment: comment,
          supervisorName: supervisorName,
          supervisorApprovedAt: nowStr,
          rating: rating || s.rating,
          logs: [...currentLogs, approveLog]
        };
      }
      return s;
    }));
  };

  const handleRejectBySupervisor = (id: string, name: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const rejectLog = {
          id: `log_${Date.now()}_sup_reject`,
          userName: name,
          userRole: 'supervisor',
          action: 'reject' as const,
          actionLabel: 'مخالفت و ارجاع جهت اصلاح مدارک (عودت به کارشناس)',
          timestamp: nowStr,
          comment: 'عدم تایید مدارک و بازگردانی جهت اصلاح برقراری مجدد در پیش‌نویس ها'
        };
        const currentLogs = s.logs || [];
        return {
          ...s,
          status: 'draft', // Sent back to drafter's draft status
          supervisorComment: null,
          supervisorApprovedAt: null,
          supervisorName: null,
          rating: undefined,
          logs: [...currentLogs, rejectLog]
        };
      }
      return s;
    }));
  };

  const handleApproveByManager = (id: string, comment: string, managerName: string, rating?: number) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const approveLog = {
          id: `log_${Date.now()}_mgr_approve`,
          userName: managerName,
          userRole: 'manager',
          action: 'approve' as const,
          actionLabel: 'بررسی صحت، تایید و امضاء دیجیتال توسط مدیر ارشد دپارتمان فنی',
          timestamp: nowStr,
          comment: comment
        };
        const currentLogs = s.logs || [];
        return {
          ...s,
          status: 'sent_to_president',
          managerComment: comment,
          managerName: managerName,
          managerApprovedAt: nowStr,
          rating: rating || s.rating,
          logs: [...currentLogs, approveLog]
        };
      }
      return s;
    }));
  };

  const handleRejectByManager = (id: string, name: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const rejectLog = {
          id: `log_${Date.now()}_mgr_reject`,
          userName: name,
          userRole: 'manager',
          action: 'reject' as const,
          actionLabel: 'نیاز به بازنگری مجدد توسط مدیر دپارتمان عودت داده شد.',
          timestamp: nowStr,
          comment: 'مخالفت و بازگردانی پرونده به کارتابل سرپرست کارگاه جهت شفاف سازی'
        };
        const currentLogs = s.logs || [];
        return {
          ...s,
          status: 'sent_to_supervisor', // Reject back to supervisor level
          managerComment: null,
          managerApprovedAt: null,
          managerName: null,
          supervisorComment: 'نیاز به شفاف سازی مجدد توسط مدیر دپارتمان عودت داده شد.',
          supervisorApprovedAt: null,
          rating: undefined,
          logs: [...currentLogs, rejectLog]
        };
      }
      return s;
    }));
  };

  const handleApproveByPresident = (id: string, comment: string, presidentName: string, rating?: number) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const approveLog = {
          id: `log_${Date.now()}_pres_approve`,
          userName: presidentName,
          userRole: 'president',
          action: 'approve' as const,
          actionLabel: 'توشیح نهایی عالی، مهر دیجیتال و ابلاغ قطعی پورتال توسط رئیس شرکت',
          timestamp: nowStr,
          comment: comment
        };
        const currentLogs = s.logs || [];
        return {
          ...s,
          status: 'approved_by_president',
          presidentComment: comment,
          presidentName: presidentName,
          presidentApprovedAt: nowStr,
          rating: rating || s.rating,
          logs: [...currentLogs, approveLog]
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
      localStorage.removeItem('wf_departments');
      setUsers(INITIAL_USERS);
      setTemplates(INITIAL_TEMPLATES);
      setSubmissions(INITIAL_SUBMISSIONS);
      setDepartments(['فنی و مهندسی', 'امور قراردادها', 'کنترل اسناد (Dcc)']);
      setCurrentUser(INITIAL_USERS.find(u => u.role === 'staff') || INITIAL_USERS[0]);
      alert('کل اطلاعات با موفقیت ریست شد.');
    }
  };

  // Calculated overall statistics
  const countPendingSupervisor = submissions.filter(s => s.status === 'sent_to_supervisor').length;
  const countPendingManager = submissions.filter(s => s.status === 'sent_to_manager').length;
  const countPendingPresident = submissions.filter(s => s.status === 'sent_to_president').length;
  const countApproved = submissions.filter(s => s.status === 'approved_by_president').length;

  if (!currentUser) {
    return <Login users={users} onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div id="app-root" className={`min-h-screen pb-12 font-sans transition-colors duration-250 ${darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-100 text-slate-900'}`} dir="rtl">
      
      {/* Top Main Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm print:hidden">
        <div className="w-full px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {companyLogo ? (
              <div className="h-12 w-28 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow border border-slate-700 flex items-center justify-center overflow-hidden">
                <img src={companyLogo} alt="لوگوی سازمان" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="p-2.5 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-xl shadow">
                <Landmark className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100">سامانه محلی مدیریت گردش کار کارمندان</h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">پورتال اختصاصی تحت شبکه سازمان</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">شبیه‌ساز گردش اطلاعات فرابخشی و مکاتبات اداری مصوب با امکان بارگذاری پیوست و کالیبراسیون</p>
            </div>
          </div>

          {/* Quick Tab control and Dark Mode toggle */}
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button
                id="workflow-simulator-tab"
                onClick={() => setActiveNavbarTab('workflow')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeNavbarTab === 'workflow'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>شبیه‌ساز گردش فرم‌ها</span>
              </button>

              <button
                id="org-chart-tab"
                onClick={() => setActiveNavbarTab('org-chart')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeNavbarTab === 'org-chart'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Network className="w-4 h-4" />
                <span>چارت سازمانی</span>
              </button>

              {currentUser.role === 'admin' && (
                <button
                  id="php-codeinstall-tab"
                  onClick={() => setActiveNavbarTab('php-code')}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeNavbarTab === 'php-code'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>کدهای کامل PHP دیتابیس</span>
                </button>
              )}
            </div>

            {/* Aesthetic Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center animate-none"
              title={darkMode ? 'تغییر به تم روز' : 'تغییر به تم شب'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Logout button */}
            <button
              onClick={() => setCurrentUser(null)}
              className="p-2.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/50 text-rose-300 hover:text-white rounded-xl cursor-pointer transition-all shadow-md flex items-center gap-1.5 font-bold text-[11px]"
              title="خروج از سامانه"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">خروج از سامانه</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full px-4 md:px-8 mt-6">
        
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

            {/* Live Network & Traffic Stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xs print:hidden">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-slate-300">وضعیت پورتال اختصاصی تحت شبکه: آنلاین و فعال</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-350">کاربران فعال پورتال:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">۲۴ کاربر آنلاین</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-350">کل بازدیدها:</span>
                  <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{totalViews} مرتبه</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-350">بازدیدهای امروز:</span>
                  <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">{dailyViews} مرتبه</span>
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
                    onDeleteUser={handleDeleteUser}
                    onAddTemplate={handleAddTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    departments={departments}
                    onAddDepartment={handleAddDepartment}
                    onDeleteDepartment={handleDeleteDepartment}
                    projects={projects}
                    onAddProject={handleAddProject}
                    onDeleteProject={handleDeleteProject}
                    submissions={submissions}
                    companyLogo={companyLogo}
                    onLogoChange={handleLogoChange}
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
                    onRecordView={handleRecordViewSubmission}
                  />
                )}

                {currentUser.role === 'manager' && (
                  <ManagerReview
                    currentUser={currentUser}
                    submissions={submissions}
                    templates={templates}
                    onApproveByManager={handleApproveByManager}
                    onRejectByManager={handleRejectByManager}
                    onRecordView={handleRecordViewSubmission}
                  />
                )}

                {currentUser.role === 'president' && (
                  <PresidentReview
                    currentUser={currentUser}
                    submissions={submissions}
                    templates={templates}
                    onApproveByPresident={handleApproveByPresident}
                    onRecordView={handleRecordViewSubmission}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Organizational Chart Tab */}
        {activeNavbarTab === 'org-chart' && (
          <OrgChart onReturnToMain={() => setActiveNavbarTab('workflow')} />
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

      {/* Corporate footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden">
        <div className="w-full px-4 text-center">
          <p>© ۱۴۰۵ تمامی حقوق مادی و معنوی پورتال مکتوب سازمان محفوظ است.</p>
          <p className="mt-2 font-semibold text-slate-600 dark:text-slate-300">
            توسعه‌دهنده سیستم: مهندس مهدی اسماعیلی سرپرست فناوری اطلاعات و ارتباطات شرکت عمران آذرستان کارگاه بوشهر
          </p>
        </div>
      </footer>

    </div>
  );
}
