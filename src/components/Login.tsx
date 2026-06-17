import React, { useState } from 'react';
import { User } from '../types';
import { Lock, UserCheck, Shield, Key, Eye, EyeOff, Landmark, AlertCircle, HelpCircle } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export default function Login({ users, onLoginSuccess }: LoginProps) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const checkCode = code.trim();
    const checkPass = password.trim();

    // Find user with entered code
    const user = users.find(u => u.code.toLowerCase() === checkCode.toLowerCase());

    if (!user) {
      setError('کاربری با این کد پرسنلی در سامانه یافت نشد.');
      return;
    }

    if (user.passwordHint !== checkPass) {
      setError('کلمه عبور وارد شده نادرست است. مجدداً تلاش نمایید.');
      return;
    }

    // Success
    onLoginSuccess(user);
  };

  // Helper autofill function
  const handleAutofill = (demoCode: string, demoPass: string) => {
    setCode(demoCode);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" dir="rtl">
      
      {/* Brand & Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
          <Landmark className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          پورتال یکپارچه مکاتبات و گردش کار سازمان
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          سامانه اختصاصی مدیریت تاییدات، کالیبراسیون و بایگانی اسناد تحت شبکه داخلی کارگاه
        </p>
      </div>

      {/* Main Login Form Area */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
          
          {error && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personnel Code Input */}
            <div>
              <label htmlFor="personnel-code" className="block text-xs font-semibold text-slate-350 mb-1.5">
                شناسه کاربری / کد پرسنلی ورود
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="personnel-code"
                  type="text"
                  required
                  placeholder="مثال: admin یا 1001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs focus:outline-none text-slate-100 placeholder-slate-500 text-right font-mono"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-350 mb-1.5">
                کلمه عبور اختصاصی شبکه
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs focus:outline-none text-slate-100 placeholder-slate-500 text-right font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-550 text-white font-bold rounded-xl p-3 text-xs transition-all shadow-md active:scale-98 cursor-pointer"
            >
              ورود امن به سامانه مکتوب
            </button>
          </form>

          {/* Quick Demo Credentials Cheat sheet */}
          <div className="mt-8 pt-5 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 mb-3 text-[11px] text-slate-400 font-semibold justify-center">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>کلیدهای ورود نمایشی جهت تست سریع گردش کار (کلیک کنید)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {/* Admin login helper */}
              <button
                type="button"
                onClick={() => handleAutofill('admin', 'admin123')}
                className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 text-slate-300 hover:text-white p-2 rounded-xl text-right transition-all flex flex-col gap-0.5 justify-center cursor-pointer"
              >
                <span className="font-bold flex items-center gap-1 text-rose-450">
                  <Shield className="w-3 h-3 text-rose-500" />
                  مدیر کل سیستم (ادمین)
                </span>
                <span className="text-[9px] font-mono text-slate-500">کد: admin / رمز: admin123</span>
              </button>

              {/* CEO login helper */}
              <button
                type="button"
                onClick={() => handleAutofill('9001', 'president9001')}
                className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 text-slate-300 hover:text-white p-2 rounded-xl text-right transition-all flex flex-col gap-0.5 justify-center cursor-pointer"
              >
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-500" />
                  رئیس عالی شرکت
                </span>
                <span className="text-[9px] font-mono text-slate-500">کد: 9001 / رمز: president9001</span>
              </button>

              {/* Manager login helper */}
              <button
                type="button"
                onClick={() => handleAutofill('3001', '123456')}
                className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 text-slate-300 hover:text-white p-2 rounded-xl text-right transition-all flex flex-col gap-0.5 justify-center cursor-pointer"
              >
                <span className="font-bold text-emerald-400 font-sans">
                  مدیر ارشد دپارتمان فنی
                </span>
                <span className="text-[9px] font-mono text-slate-500">کد: 3001 / رمز: 123456</span>
              </button>

              {/* Supervisor login helper */}
              <button
                type="button"
                onClick={() => handleAutofill('2001', '123456')}
                className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 text-slate-300 hover:text-white p-2 rounded-xl text-right transition-all flex flex-col gap-0.5 justify-center cursor-pointer"
              >
                <span className="font-bold text-amber-500 font-sans">
                  سرپرست کارگاه
                </span>
                <span className="text-[9px] font-mono text-slate-500">کد: 2001 / رمز: 123456</span>
              </button>

              {/* Staff login helper */}
              <button
                type="button"
                onClick={() => handleAutofill('1001', '123456')}
                className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700 text-slate-350 hover:text-white p-2 rounded-xl col-span-2 text-center transition-all flex flex-col gap-0.5 justify-center cursor-pointer"
              >
                <span className="font-bold text-indigo-450 font-sans">
                  کارشناس دپارتمان مهندسی (علی حسینی)
                </span>
                <span className="text-[9px] font-mono text-slate-500">کد پرسنلی: 1001 / رمز پیش‌فرض: 123456</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
