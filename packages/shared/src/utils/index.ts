// Utility functions that can be shared between frontend and backend

export const formatCurrency = (amount: number, currency = 'THB'): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string, locale = 'th-TH'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Thai phone number validation
  const phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
  return phoneRegex.test(phone);
};
