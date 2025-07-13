import Cookies from 'js-cookie';

export function clearAllAuthState() {
  localStorage.removeItem('civic_jwt');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
}
