import React from 'react';
import styles from './LoginPage.module.css'; 

const CheckEmailPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header} style={{ textAlign: 'center' }}>
                    <h1 className={styles.logo}>Check Your Inbox</h1>
                    <p className={styles.title} style={{ marginTop: '1rem' }}>We've sent a verification link to your email address.</p>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                        Please click the link in the email to activate your account. You can close this tab.
                    </p>
                </div>
            </div>
        </div>
    );
};
export default CheckEmailPage;