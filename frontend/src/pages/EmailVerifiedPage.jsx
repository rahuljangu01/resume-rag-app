import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

const EmailVerifiedPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header} style={{ textAlign: 'center' }}>
                    <h1 className={styles.logo}>✅ Email Verified!</h1>
                    <p className={styles.title} style={{ marginTop: '1rem' }}>Your account has been successfully activated.</p>
                    <Link to="/login" className={styles.button} style={{ marginTop: '2rem', textDecoration: 'none' }}>
                        Proceed to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default EmailVerifiedPage;