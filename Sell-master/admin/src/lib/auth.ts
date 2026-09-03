export type AdminUser = {
  _id?: string;
  name: string;
  email: string;
  role: string;
  token: string;
};

export const getStoredAdminUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem('pacxone-admin-user');
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
};

export const setStoredAdminUser = (user: AdminUser) => {
  localStorage.setItem('pacxone-admin-user', JSON.stringify(user));
  localStorage.setItem('pacxone-token', user.token);
};

export const clearStoredAdminUser = () => {
  localStorage.removeItem('pacxone-admin-user');
  localStorage.removeItem('pacxone-token');
};
