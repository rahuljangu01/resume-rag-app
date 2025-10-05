// frontend/src/components/DashboardLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import styles from './DashboardLayout.module.css';

// --- SVG Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;


const DashboardLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    
    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logoText}>ResumeRAG</h1>
                </div>
                <nav className={styles.nav}>
                    <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                        <SearchIcon /> <span>Search</span>
                    </NavLink>
                    <NavLink to="/upload" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                        <UploadIcon /> <span>Upload Resumes</span>
                    </NavLink>
                </nav>
                <div className={styles.logoutButtonContainer}>
                    <button onClick={toggleTheme} className={styles.themeButton}>
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        <LogoutIcon /> <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;