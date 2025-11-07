'use client';

export function useAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const tokens = localStorage.getItem('auth_tokens');
  if (!tokens) {
    return null;
  }

  try {
    const parsed = JSON.parse(tokens);
    return parsed.accessToken || null;
  } catch {
    return null;
  }
}
