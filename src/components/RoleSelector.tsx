import React from 'react';
import { User } from '../types';
import { Shield, FilePen, UserCheck, Briefcase, Crown, HelpCircle } from 'lucide-react';

interface RoleSelectorProps {
  users: User[];
  currentUser: User;
  onUserChange: (user: User) => void;
}

export default function RoleSelector({ users, currentUser, onUserChange }: RoleSelectorProps) {
  // Group users by role
  const rolesMap = {
    admin: { label: 'مدیر سیستم (ادمین شبکه)', color: 'bg-rose-50 border-rose-200 text-rose-700', icon: Shield },
    staff: { label: 'کارشناس واحد (تهیه فرم)', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: FilePen },
    supervisor: { label: 'سرپرست بخش (تایید اولیه)', color: 'bg-amber-50 border-amber-200 text-amber-700', icon: UserCheck },
    manager: { label: 'مدیر دپارتمان (تایید ثانویه)', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: Briefcase },
    president: { label: 'رئیس کل شرکت (تایید نهایی)', color: 'bg-amber-100 border-amber-300 text-amber-900', icon: Crown }
  };

  return (
    <div id="role-selector-root" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            شبیه‌ساز نقش‌های سازمانی (دموی تعاملی)
          </h2>
          <p className="text-xs text-slate-500">
            برای آزمایش گردش کار بین ۲۰۰ کارمند، ۲۰ سرپرست، ۱۰ مدیر و رئیس شرکت، نقش فعال خود را تغییر دهید:
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(rolesMap).map(([roleKey, value]) => {
            const roleUsers = users.filter(u => u.role === roleKey);
            const IconComponent = value.icon;
            const isSelected = currentUser.role === roleKey;

            return (
              <div key={roleKey} className="relative group">
                <button
                  id={`role-btn-${roleKey}`}
                  onClick={() => {
                    if (roleUsers.length > 0) {
                      onUserChange(roleUsers[0]);
                    }
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    isSelected
                      ? `${value.color} ring-2 ring-offset-2 ring-slate-400 scale-[1.03] shadow-sm`
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{value.label.split(' ')[0]}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Switcher Dropdown (Inside selected Role type, let user choose specific staff or supervisor) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">کاربر فعال شبیه‌سازی:</span>
          <select
            id="user-picker"
            value={currentUser.id}
            onChange={(e) => {
              const selected = users.find(u => u.id === e.target.value);
              if (selected) onUserChange(selected);
            }}
            className="bg-white border border-slate-200 rounded-md py-1 px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            {users
              .filter(u => u.role === currentUser.role)
              .map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} - ({u.unit}) [کد ورودی: {u.code}]
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>رمز عبور پیش‌فرض این کاربر غیرازمین: </span>
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[10px]">
            {currentUser.passwordHint}
          </code>
        </div>
      </div>
    </div>
  );
}
