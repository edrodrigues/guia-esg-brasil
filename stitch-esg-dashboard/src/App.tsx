import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DiagnosticProtectedRoute } from './components/DiagnosticProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { LandingPage } from './pages/LandingPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { ReportsPage } from './pages/ReportsPage';
import { EnvironmentalPage } from './pages/EnvironmentalPage';
import { SocialPage } from './pages/SocialPage';
import { GovernancePage } from './pages/GovernancePage';

// Helper component to redirect logged-in users away from auth pages
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
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
      
      {/* Catch-all - Redirect to landing or dashboard based on status */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
