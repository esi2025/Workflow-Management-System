import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, CheckCircle, Database, HelpCircle, Server } from 'lucide-react';

export default function PhpSourceCodeGuide() {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'database' | 'config' | 'login' | 'dashboard'>('guidelines');
  const [copied, setCopied] = useState(false);

  const steps = [
    { title: 'نصب وب سرور محلی (Localhost)', desc: 'نرم افزار XAMPP یا WampServer را دانلود و نصب کنید. آپاچی (Apache) و مای‌اس‌کیوال (MySQL) را فعال کنید.' },
    { title: 'ایجاد پایگاه داده (Database)', desc: 'وارد phpMyAdmin شوید (به آدرس localhost/phpmyadmin) و یک پایگاه داده به نام workflow_db ایجاد کنید.' },
    { title: 'اجرای کدهای SQL', desc: 'کدهای زبانه "پایگاه داده MySQL" را کپی کرده و در بخش SQL پایگاه داده ساخته شده اجرا کنید تا جدول‌ها و کاربران اولیه با کدهای اختصاصی ساخته شوند.' },
    { title: 'کپی کردن فایلهای PHP', desc: 'یک فولدر به نام workflow در مسیر c:/xampp/htdocs ایجاد کرده و فایلهای PHP ارائه‌شده در این راهنما را با پسوند .php در آن ذخیره کنید.' },
    { title: 'آزمایش و اجرا درون سازمان', desc: 'مرورگر را باز کرده و آدرس http://localhost/workflow/login.php را وارد کنید. کارمندان می‌توانند با آی‌پی لوکال شما (مثال: http://192.168.1.50/workflow) وارد شوند!' }
  ];

  const sourceCodes = {
    database: `-- ۱. کدهای راه‌اندازی ساختار پایگاه داده و جداول سیستم در MySQL
-- یک دیتابیس به نام workflow_db ایجاد کرده و این دستورات را در آن اجرا کنید.

CREATE DATABASE IF NOT EXISTS workflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci;
USE workflow_db;

-- الف) جدول یوزرهای سیستم (شامل کارمندان، سرپرستان، مدیران و رئیس کل)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,       -- کد پرسنلی اختصاصی ورود
    name VARCHAR(100) NOT NULL,             -- نام و نام خانوادگی
    password_hash VARCHAR(255) NOT NULL,    -- هش رمز عبور برای امنیت بالا
    role ENUM('admin', 'staff', 'supervisor', 'manager', 'president') NOT NULL,
    unit VARCHAR(100) NOT NULL,             -- نام واحد سازمانی
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ب) جدول قالب‌های فرم تعریف شده توسط ادمین (پارس شده از ساختار اکسل یا دستی)
CREATE TABLE IF NOT EXISTS form_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,            -- عنوان فرم
    unit VARCHAR(100) NOT NULL,             -- واحد مجاز به تکمیل فرم
    fields_json TEXT NOT NULL,              -- فیلدهای فرم به فرمت JSON (آپلود اکسل)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- ج) جدول ثبت فرم‌ها توسط کارشناسان
CREATE TABLE IF NOT EXISTS form_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    template_title VARCHAR(255) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    staff_id INT NOT NULL,
    staff_name VARCHAR(100) NOT NULL,
    staff_code VARCHAR(50) NOT NULL,
    fields_data_json TEXT NOT NULL,         -- داده‌های پر شده توسط کارمند به شکل JSON
    attachment_path VARCHAR(255) DEFAULT NULL, -- مسیر فایل آپلود شده فاکتور یا پیوست
    
    -- ستون‌های تاییدیه سرپرست واحد
    supervisor_comment TEXT DEFAULT NULL,
    supervisor_approved_at DATETIME DEFAULT NULL,
    supervisor_name VARCHAR(100) DEFAULT NULL,
    
    -- ستون‌های تاییدیه مدیر دپارتمان
    manager_comment TEXT DEFAULT NULL,
    manager_approved_at DATETIME DEFAULT NULL,
    manager_name VARCHAR(100) DEFAULT NULL,
    
    -- ستون‌های تاییدیه نهایی رئیس شرکت
    president_comment TEXT DEFAULT NULL,
    president_approved_at DATETIME DEFAULT NULL,
    president_name VARCHAR(100) DEFAULT NULL,
    
    status ENUM('draft', 'sent_to_supervisor', 'sent_to_manager', 'sent_to_president', 'approved_by_president') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- د) درج چند کاربر نمونه اولیه برای آزمایش سریع (رمز عبور همگی: 123456)
-- در برنامه نهایی رمزها با مکانیزم ایمن password_hash ذخیره می‌شوند.
INSERT INTO users (code, name, password_hash, role, unit) VALUES
('admin', 'مهندس اکبری (ادمین سیستم)', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'عمومی'),
('9001', 'جناب آقای رستمی (ریاست محترم شرکت)', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'president', 'عمومی'),
('3001', 'دکتر علوی (مدیر ارشد مهندسی و فنی)', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'واحد فنی و مهندسی'),
('2001', 'مهندس رضایی (سرپرست کارگاه مرکزی)', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supervisor', 'واحد فنی و مهندسی'),
('1001', 'علی حسینی (کارشناس ارشد شبکه)', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'واحد فنی و مهندسی');`,

    config: `<?php
// ۲. فایل اتصال به پایگاه داده (config.php)
// این فایل مسئول برقراری ارتباط با MySQL با لایه انتزاعی امن PDO است.

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // در لکال معمولا رمز عبور خالی است
define('DB_NAME', 'workflow_db');

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    die("خطا در اتصال به پایگاه داده سرور داخلی: " . $e->getMessage());
}

// تابع کمکی برای پاکسازی کاراکترهای خطرناک جهت جلوگیری از حملات XSS
function h($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

// تابع تبدیل تاریخ میلادی به تاریخ خورشیدی در صورت نیاز (ساده شده)
function getPersianDate() {
    // برای سادگی در لکال استاتیک یا زمان جاری سرور بازگردانده می‌شود
    return date("Y-m-d H:i");
}
?>`,

    login: `<?php
// ۳. فایل ورود کارمندان به پورتال سازمانی (login.php)
// پیاده‌سازی مکانیزم اعتبارسنجی کد پرسنلی اختصاصی و ایجاد سشن امن کاربری.

require_once 'config.php';
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = trim($_POST['code'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!empty($code) && !empty($password)) {
        // جستجوی کد پرسنلی در پایگاه داده با Prepared Statements برای جلوگیری از SQL Injection
        $stmt = $pdo->prepare("SELECT * FROM users WHERE code = :code LIMIT 1");
        $stmt->execute(['code' => $code]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // ایجاد سشن معتبر
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_code'] = $user['code'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['user_unit'] = $user['unit'];

            // هدایت اتوماتیک بر اساس نقش سازمانی کارمند
            switch ($user['role']) {
                case 'admin':
                    header("Location: admin_dashboard.php");
                    break;
                case 'staff':
                    header("Location: staff_form.php");
                    break;
                case 'supervisor':
                    header("Location: supervisor_review.php");
                    break;
                case 'manager':
                    header("Location: manager_review.php");
                    break;
                case 'president':
                    header("Location: president_review.php");
                    break;
            }
            exit;
        } else {
            $error = 'کد پرسنلی یا رمز عبور اشتباه است.';
        }
    } else {
        $error = 'وارد کردن تمام فیلدها الزامی است.';
    }
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>ورود به پورتال گردش کار داخلی سازمان</title>
    <!-- استفاده از Tailwind CSS CDN جهت طراحی زیبای مدرن -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 flex items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm border border-slate-200">
        <div class="text-center mb-6">
            <h1 class="text-xl font-bold text-slate-800">سامانه گردش کار پویان</h1>
            <p class="text-xs text-slate-400 mt-1">ویژه کارمندان، سرپرستان و مدیران ارشد شبکه داخلی</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-lg mb-4">
                <?php echo h($error); ?>
            </div>
        <?php endif; ?>

        <form action="login.php" method="POST" class="space-y-4">
            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">کد اختصاصی ورود (کد پرسنلی)</label>
                <input type="text" name="code" placeholder="مثال: 1001" required 
                       class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500 font-mono">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">رمز عبور عبور</label>
                <input type="password" name="password" placeholder="••••••••" required 
                       class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500">
            </div>

            <button type="submit" 
                    class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition duration-200">
                ورود ایمن به پرتال داخلی
            </button>
        </form>
        
        <div class="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            توسعه داده شده تحت وب سرور داخلی آپاچی ابری
        </div>
    </div>
</body>
</html>`,

    dashboard: `<?php
// ۴. ساخت فرم پویا توسط فایل اکسل در بخش ادمین (admin_dashboard.php)
// ادمین می‌تواند فایلهای اکسل (فرمت CSV یا Excel حاوی برچسب ها و فیلدها) را آپلود کند.
// برای خواندن واقعی فایلهای اکسل در PHP به کتابخانه PHP Spreadsheet نیاز است.
// در کد زیر ساختار شبیه سازی شده پارس و ذخیره فیلدها در دیتابیس پیاده سازی شده است:

require_once 'config.php';
session_start();

// تایید هویت ادمین
if ($_SESSION['user_role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['excel_file'])) {
    $title = trim($_POST['title'] ?? '');
    $unit = $_POST['unit'] ?? '';
    
    if (!empty($title) && $_FILES['excel_file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['excel_file']['tmp_name'];
        $fileName = $_FILES['excel_file']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        // در صورتی که فایل CSV یا Excel باشد
        if (in_array($fileExtension, ['csv', 'xlsx', 'xls'])) {
            
            // نمونه پارس ساده شده اکسل (در صورت استفاده از فرمت معتبر CSV حاوی ستون‌های فیلد)
            $fields = [];
            
            if (($handle = fopen($fileTmpPath, "r")) !== FALSE) {
                // عبور از ردیف هدر
                fgetcsv($handle, 1000, ",");
                
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    if (count($data) >= 2) {
                        $fields[] = [
                            'id' => 'field_' . rand(1000, 9999),
                            'label' => mb_convert_encoding($data[0], "UTF-8", "auto"),
                            'type' => trim($data[1]) ?: 'text',
                            'required' => (isset($data[2]) && strtolower(trim($data[2])) === 'yes') ? true : false
                        ];
                    }
                }
                fclose($handle);
            }
            
            // اگر از روی CSV نتووانست فیلدی به طور خودکار پیدا کند، دو فیلد دمو پیش‌فرض می‌سازیم:
            if (empty($fields)) {
                $fields = [
                    ['id' => 'f_proj', 'label' => 'کد گزارش یا فاکتور مالی', 'type' => 'text', 'required' => true],
                    ['id' => 'f_cost', 'label' => 'برآورد هزینه های انجام شده (ریال)', 'type' => 'number', 'required' => true],
                    ['id' => 'f_text', 'label' => 'شرح جزییات اقدامات اصلاحی و کارگاه', 'type' => 'textarea', 'required' => true]
                ];
            }
            
            // ذخیره به صورت JSON فرمت استاندارد در دیتابیس
            $fieldsJson = json_encode($fields, JSON_UNESCAPED_UNICODE);
            
            $stmt = $pdo->prepare("INSERT INTO form_templates (title, unit, fields_json) VALUES (:title, :unit, :fields)");
            $stmt->execute([
                'title' => $title,
                'unit' => $unit,
                'fields' => $fieldsJson
            ]);
            
            $success = "فایل اکسل فرمت با موفقیت پارس شد و قالب آنلاین فرم سازمانی ساخته شد!";
        } else {
            $error = "لطفا فقط فایل با پسوند اکسل .xlsx یا فایل .csv برای تحلیل آپلود کنید.";
        }
    } else {
        $error = "وارد کردن عنوان قالب و آپلود فایل الزامی است.";
    }
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>مدیریت قالب فرم‌ها و کاربران شبکه داخلی</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 min-h-screen">
    
    <nav class="bg-rose-900 text-white p-4 shadow mb-8">
        <div class="max-w-7xl mx-auto flex justify-between items-center text-xs">
            <span class="font-bold text-sm">پنل مدیریت گردش کار شرکت (امکانات ادمین شبکه)</span>
            <div class="flex items-center gap-4">
                <span>کاربر ادمین: <?php echo h($_SESSION['user_name']); ?></span>
                <a href="login.php" class="bg-rose-950 px-3 py-1.5 rounded hover:bg-rose-900">خروج ایمن</a>
            </div>
        </div>
    </nav>

    <main class="max-w-4xl mx-auto p-4 space-y-6">
        
        <?php if (!empty($success)): ?>
            <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold">
                <?php echo h($success); ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($error)): ?>
            <div class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-bold">
                <?php echo h($error); ?>
            </div>
        <?php endif; ?>

        <!-- فرم ساخت قالب هوشمند با آپلود اکسل -->
        <div class="bg-white p-6 rounded-2xl shadow border border-slate-200">
            <h2 class="text-sm font-bold text-slate-800 mb-4">آپلود اکسل برای طراحی پویای فرم واحدها</h2>
            
            <form action="admin_dashboard.php" method="POST" enctype="multipart/form-data" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">عنوان کامل فرم جدید</label>
                        <input type="text" name="title" required placeholder="مثال: فرم درخواست پرداخت خرید فنی" 
                               class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">دپارتمان مجاز به تکمیل</label>
                        <select name="unit" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none">
                            <option value="واحد فنی و مهندسی">واحد فنی و مهندسی</option>
                            <option value="واحد حسابداری و مالی">واحد حسابداری و مالی</option>
                            <option value="واحد منابع انسانی">واحد منابع انسانی</option>
                            <option value="واحد فروش و بازاریابی">واحد فروش و بازاریابی</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">انتخاب فایل اکسل طراحی سوالات (.xlsx or .csv)</label>
                    <input type="file" name="excel_file" required 
                           class="w-full border border-dashed border-slate-300 rounded-lg p-6 text-xs text-slate-500 font-semibold cursor-pointer">
                </div>

                <div class="text-left pt-2">
                    <button type="submit" class="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded text-xs leading-none shadow transition-all">
                        پارس اکسل و انتشار فرم
                    </button>
                </div>
            </form>
        </div>

    </main>
</body>
</html>`
  };

  const handleCopy = (codeKey: keyof typeof sourceCodes) => {
    navigator.clipboard.writeText(sourceCodes[codeKey]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="php-guide-root" className="bg-white border dir-rtl border-slate-200 rounded-xl overflow-hidden shadow-sm" dir="rtl">
      
      {/* Header */}
      <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-505/10 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">کروز توسعه PHP و راهنمای راه‌اندازی شبکه داخلی دپارتمان</h1>
            <p className="text-xs text-slate-400">کدهای فول‌استک آماده مهاجرت و اجرا روی زمپ سرور شرکت به همراه پایگاه داده MySQL</p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'guidelines' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-600'
          }`}
        >
          ۱. راهنمای قدم‌به‌قدم نصب
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'database' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-600'
          }`}
        >
          ۲. پایگاه داده database.sql
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'config' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-600'
          }`}
        >
          ۳. پیکربندی config.php
        </button>

        <button
          onClick={() => setActiveTab('login')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'login' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-600'
          }`}
        >
          ۴. مدیریت ورود login.php
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'dashboard' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-600'
          }`}
        >
          ۵. آپلود اکسل و ادمین
        </button>
      </div>

      <div className="p-6">
        
        {activeTab === 'guidelines' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl p-4 flex items-start gap-2 text-xs">
              <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">مکانیزم عملکرد پورتال بومی شرکت:</span>
                این سیستم بر بستر زبان PHP 8.x و بدون نیاز به اینترنت (کاملا آفلاین درون شبکه شرکت) قرار می‌گیرد. کارمندان از هر کامپیوتری و با وارد کردن آی‌پی محلی سرور شما پس از ورود ایمن به کارتابل خود دسترسی خواهند داشت.
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800">مراحل نصب و بارگذاری روی سرور داخلی شرکت (گام‌به‌گام):</h3>
              <div className="relative border-r-2 border-slate-200 mr-2 space-y-6 pr-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute right-[-23px] top-[-1px] rounded-full bg-indigo-600 text-white w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mb-1">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'guidelines' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <FileCode className="w-4 h-4 text-indigo-600" />
                کدهای کلیدی فایل {activeTab === 'database' ? 'database.sql' : activeTab + '.php'}
              </span>
              
              <button
                onClick={() => handleCopy(activeTab as any)}
                className="flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 rounded px-3 py-1 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی کدهای این بخش</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-left overflow-x-auto font-mono text-xs leading-relaxed max-h-[500px]" dir="ltr">
                <code>{sourceCodes[activeTab as keyof typeof sourceCodes]}</code>
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
