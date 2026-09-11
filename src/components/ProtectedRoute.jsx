import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

export default function ProtectedRoute({ fallback = null, unauthenticatedElement = null }) {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authChecked, authError, checkAppState } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  if (isLoadingAuth || isLoadingPublicSettings || !authChecked) return fallback || (
    <div role="status" className="grid min-h-[60vh] place-items-center"><span>{t('common.loading')}</span></div>
  );
  if (authError?.type === 'user_not_registered') return <UserNotRegisteredError />;
  if (authError && !['auth_required', 'session_expired'].includes(authError.type)) return (
    <div role="alert" className="mx-auto max-w-lg px-6 py-20 text-center">
      <p>دسترسی به حساب در حال حاضر ممکن نیست. لطفاً دوباره تلاش کنید.</p>
      <button onClick={checkAppState} className="mt-5 rounded-full border px-5 py-2">تلاش دوباره</button>
    </div>
  );
  if (!isAuthenticated || authError) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    // Preserve the destination, including booking/service links after login.
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }
  return <Outlet />;
}
