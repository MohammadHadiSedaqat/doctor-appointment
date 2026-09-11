import { Toaster } from "@/components/ui/toaster"
import { lazy, Suspense, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { I18nProvider } from '@/i18n/I18nContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicLayout from '@/components/PublicLayout';
import Home from '@/pages/Home';
import { Navigate, useLocation } from 'react-router-dom';
import SeoHead from '@/components/SeoHead';
import { getLanguageFromPath, getLocaleBasename } from '@/i18n/locale';
import { publicPaths } from '@/seo/routes';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Qualifications = lazy(() => import('@/pages/Qualifications'));
const Clinic = lazy(() => import('@/pages/Clinic'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Appointment = lazy(() => import('@/pages/Appointment'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const Privacy = lazy(() => import('@/pages/Privacy'));

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { pathname } = useLocation();
  const isPublicMarketing = publicPaths.includes(pathname.replace(/\/+$/, '') || '/');
  useEffect(() => {
    if (authError?.type === 'auth_required') navigateToLogin();
  }, [authError, navigateToLogin]);

  // Show loading spinner while checking app public settings or auth
  if ((isLoadingPublicSettings || isLoadingAuth) && !isPublicMarketing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/qualifications" element={<Qualifications />} />
        <Route path="/clinic" element={<Clinic />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router basename={getLocaleBasename(getLanguageFromPath(window.location.pathname))}>
            <SeoHead />
            <ScrollToTop />
            <Suspense fallback={<div role="status" className="grid min-h-[60vh] place-items-center">در حال بارگذاری…</div>}>
              <AuthenticatedApp />
            </Suspense>
          </Router>
          <Toaster />
        </QueryClientProvider>
      </I18nProvider>
    </AuthProvider>
  )
}

export default App
