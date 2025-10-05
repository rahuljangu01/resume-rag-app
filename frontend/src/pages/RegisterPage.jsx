import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Creating account...');
        try {
            await api.post('/auth/register', { email, password, role: 'recruiter' }, {
                headers: { 'Idempotency-Key': uuidv4() }
            });
            toast.success('Registration successful! Please check your email.', { id: loadingToast });
            navigate('/check-email'); 
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.logo}>ResumeRAG</h1>
                    <h2 className={styles.title}>Create your account</h2>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className={styles.label}>Email address</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                               className={styles.input}/>
                    </div>
                    <div>
                        <label htmlFor="password"  className={styles.label}>Password</label>
                        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                               className={styles.input}/>
                    </div>
                    <div>
                        <button type="submit" className={styles.button}>
                            Sign Up
                        </button>
                    </div>
                </form>
                 <p className={styles.footerText}>
                    Already have an account?{' '}
                    <Link to="/login" className={styles.link}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;