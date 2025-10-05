import React, { useState, useEffect  } from 'react';
import { Link, useNavigate, useSearchParams  } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [needsVerification, setNeedsVerification] = useState(false);
    const [searchParams] = useSearchParams();
     useEffect(() => {
        if (searchParams.get('verified') === 'true') {
            toast.success("Email successfully verified! You can now log in.");
        }
    }, [searchParams]);

    // Function to automatically fill in demo credentials
    const fillDemoCredentials = () => {
        setEmail('admin@mail.com');
        setPassword('admin123');
        toast.success('Demo credentials filled!');
    };

    // Function for the "Resend Email" button
    const handleResend = async () => {
        if (!email) {
            toast.error("Please enter your email address to resend the verification link.");
            return;
        }
        const loadingToast = toast.loading('Resending email...');
        try {
            await api.post('/auth/resend-verification', { email }, {
                headers: { 'Idempotency-Key': uuidv4() }
            });
            toast.success('Verification email resent! Please check your inbox and spam folder.', { id: loadingToast, duration: 5000 });
            setNeedsVerification(false);
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || 'Failed to resend email.';
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNeedsVerification(false);
        const loadingToast = toast.loading('Logging in...');
        try {
            const response = await api.post('/auth/login', { email, password }, {
                headers: { 'Idempotency-Key': uuidv4() }
            });
            login(response.data.token);
            toast.success('Logged in successfully!', { id: loadingToast });
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || 'Login failed.';
            
            if (errorMessage.includes('Please verify your email')) {
                setNeedsVerification(true);
            }
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                     <h1 className={styles.logo}>ResumeRAG</h1>
                     <h2 className={styles.title}>Sign in to your account</h2>
                </div>

                {/* --- Demo Credentials Box --- */}
                <div className={styles.demoBox}>
                    <div className={styles.demoHeader}>
                        <span className={styles.demoTitle}>Demo Credentials</span>
                        <button onClick={fillDemoCredentials} className={styles.fillButton}>Click to Fill</button>
                    </div>
                    <p className={styles.demoText}><strong>Email:</strong> admin@mail.com</p>
                    <p className={styles.demoText}><strong>Password:</strong> admin123</p>
                </div>
                {/* --- End of Demo Box --- */}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className={styles.label}>Email address</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
                    </div>
                    <div>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} />
                    </div>
                    <div>
                        <button type="submit" className={styles.button}>
                            Sign in
                        </button>
                    </div>
                </form>

                {/* --- Resend Verification Section --- */}
                {needsVerification && (
                    <div className={styles.resendContainer}>
                        <p className={styles.resendText}>Your account is not verified.</p>
                        <button onClick={handleResend} className={styles.resendButton}>
                            Resend Verification Email
                        </button>
                    </div>
                )}
                {/* --- End of Resend Section --- */}

                <p className={styles.footerText}>
                    Don't have an account?{' '}
                    <Link to="/register" className={styles.link}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;