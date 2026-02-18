import { BrowserRouter, Routes, Route } from 'react-router';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/dashboard/:year" element={<DashboardPage />} />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'bg-slate-900 border-slate-800 text-white',
              }}
            />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
