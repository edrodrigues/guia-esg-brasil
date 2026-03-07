import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DiagnosticProtectedRoute } from './components/DiagnosticProtectedRoute';

// Dynamic Imports for Pages
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const OrganizationPage = lazy(() => import('./pages/OrganizationPage').then(m => ({ default: m.OrganizationPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DiagnosticPage = lazy(() => import('./pages/DiagnosticPage').then(m => ({ default: m.DiagnosticPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const RankingPage = lazy(() => import('./pages/RankingPage').then(m => ({ default: m.RankingPage })));
const EnvironmentalPage = lazy(() => import('./pages/EnvironmentalPage').then(m => ({ default: m.EnvironmentalPage })));
const SocialPage = lazy(() => import('./pages/SocialPage').then(m => ({ default: m.SocialPage })));
const GovernancePage = lazy(() => import('./pages/GovernancePage').then(m => ({ default: m.GovernancePage })));
const PrivacidadePage = lazy(() => import('./pages/PrivacidadePage').then(m => ({ default: m.PrivacidadePage })));
const TermosPage = lazy(() => import('./pages/TermosPage').then(m => ({ default: m.TermosPage })));
const CompliancePage = lazy(() => import('./pages/CompliancePage').then(m => ({ default: m.CompliancePage })));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Helper component to redirect logged-in users away from auth pages
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacidade" element={<PrivacidadePage />} />
        <Route path="/termos" element={<TermosPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        
        {/* Auth Pages - Redirect if already logged in */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/organization" 
          element={
            <ProtectedRoute>
              <OrganizationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/diagnostic" 
          element={
            <ProtectedRoute>
              <DiagnosticPage />
            </ProtectedRoute>
          } 
        />
        
        {/* ESG Pillar Pages - Protected by Diagnostic Completion */}
        <Route 
          path="/environmental" 
          element={
            <DiagnosticProtectedRoute>
              <EnvironmentalPage />
            </DiagnosticProtectedRoute>
          } 
        />
        <Route 
          path="/social" 
          element={
            <DiagnosticProtectedRoute>
              <SocialPage />
            </DiagnosticProtectedRoute>
          } 
        />
        <Route 
          path="/governance" 
          element={
            <DiagnosticProtectedRoute>
              <GovernancePage />
            </DiagnosticProtectedRoute>
          } 
        />

        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ranking" 
          element={
            <ProtectedRoute>
              <RankingPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all - Redirect to landing or dashboard based on status */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
