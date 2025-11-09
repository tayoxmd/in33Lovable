// رمز الريال السعودي الجديد من البنك المركزي السعودي
export const SAR_SYMBOL = '﷼';

// دالة لتنسيق العملة
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('ar-SA')} ${SAR_SYMBOL}`;
};

// دالة للحصول على رمز العملة حسب اللغة
export const getCurrencySymbol = (language: string): string => {
  return language === 'ar' ? SAR_SYMBOL : 'SAR';
};
