import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

const VerificationFailedPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header} style={{ textAlign: 'center' }}>
                    <h1 className={styles.logo}>❌ Verification Failed</h1>
                    <p className={styles.title} style={{ marginTop: '1rem' }}>
                        The verification link is invalid or has expired.
                    </p>
                     <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                        Please try registering again.
                    </p>
                    <Link to="/register" className={styles.button} style={{ marginTop: '2rem', textDecoration: 'none' }}>
                        Back to Register
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default VerificationFailedPage;