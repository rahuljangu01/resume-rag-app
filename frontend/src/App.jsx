import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import SearchPage from './pages/SearchPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import PrivateRoute from './utils/PrivateRoute.jsx';
import { Toaster } from 'react-hot-toast';


import CheckEmailPage from './pages/CheckEmailPage.jsx';
import EmailVerifiedPage from './pages/EmailVerifiedPage.jsx';
import VerificationFailedPage from './pages/VerificationFailedPage.jsx';


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
     
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/check-email" element={<CheckEmailPage />} />
            <Route path="/email-verified" element={<EmailVerifiedPage />} />
            <Route path="/verification-failed" element={<VerificationFailedPage />} />
            
           
            <Route path="/verify-email/:token" element={null} />

            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<SearchPage />} />
                <Route path="/upload" element={<UploadPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;