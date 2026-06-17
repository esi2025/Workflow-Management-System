/**
 * converts Gregorian date strings (e.g., "2026-06-13" or ISO strings)
 * into a beautiful Iranian/Shamsi (Solar Hijri) formatted date with month names in Persian.
 */
export function toPersianDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '---';
  
  let date: Date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    const strInput = String(dateInput).trim();
    if (!strInput) return '---';
    
    // Check if it's already in Persian format (e.g. containing slash but not starting with 4 digits for gregorian YYYY-MM-DD)
    if (strInput.includes('/') && !strInput.match(/^\d{4}[-/]\d{2}[-/]\d{2}/)) {
      return strInput;
    }
    
    // Some mock data dates might be simple strings like "۱۴۰۵/۰۳/۱۸", return them directly
    if (strInput.match(/^[۰-۹0-9]{4}\/[۰-۹0-9]{2}\/[۰-۹0-9]{2}/) && !strInput.startsWith('202')) {
      return strInput;
    }

    // Try parsing the ISO or standard date
    date = new Date(strInput);
  }

  if (isNaN(date.getTime())) {
    return String(dateInput);
  }

  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let g_day_no = 365 * gy + Math.floor((gy - 1) / 4) - Math.floor((gy - 1) / 100) + Math.floor((gy - 1) / 400);

  for (let i = 0; i < gm - 1; ++i) {
    g_day_no += g_days_in_month[i];
  }

  if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
    ++g_day_no;
  }

  g_day_no += gd;

  let j_day_no = g_day_no - 79;
  const j_np = Math.floor(j_day_no / 12053);
  j_day_no %= 12053;

  let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  let jm = 0;
  for (let i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
    j_day_no -= j_days_in_month[i];
    jm = i + 1;
  }
  if (jm === 0) jm = 1;
  else jm += 1;
  
  const jd = j_day_no + 1;

  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const monthName = monthNames[jm - 1];

  // Convert digits to Persian representation
  const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  const toPersianNumbers = (num: number | string): string => {
    return String(num).split('').map(char => {
      const parsed = parseInt(char, 10);
      return isNaN(parsed) ? char : pDigits[parsed];
    }).join('');
  };

  return `${toPersianNumbers(jd)} ${monthName} ${toPersianNumbers(jy)}`;
}

/**
 * React hook that returns a function to format Gregorian dates into Shamsi dynamic strings.
 */
export function usePersianDate() {
  return {
    formatDate: toPersianDate
  };
}
