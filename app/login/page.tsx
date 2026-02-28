'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loginError, setLoginError] = useState('');

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!credentials.email.trim()) errs.email = 'Email obbligatoria';
        if (!credentials.password) errs.password = 'Password obbligatoria';
        if (credentials.password && credentials.password.length < 8) {
            errs.password = 'Minimo 8 caratteri';
        }
        return errs;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoginError('');
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});

        /* 
         * Mock login logic — will be replaced with Supabase Auth.
         * For now, we demo redirect based on credentials.
         */
        if (credentials.email === 'admin@mare.it' && credentials.password === 'admin1234') {
            router.push('/admin');
        } else if (credentials.email === 'staff@mare.it' && credentials.password === 'staff1234') {
            router.push('/dipendenti');
        } else {
            setLoginError('Credenziali non valide. Riprova.');
        }
    };

    const handleChange = (field: string, value: string) => {
        setCredentials((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
        if (loginError) setLoginError('');
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.loginIcon}>🔐</div>
                <h1 className={styles.loginTitle}>Accedi</h1>
                <p className={styles.loginSubtitle}>
                    Inserisci le tue credenziali per accedere al pannello di gestione.
                </p>

                {loginError && (
                    <div className={styles.loginError}>{loginError}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            className={styles.formInput}
                            placeholder="nome@ristorante.it"
                            value={credentials.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            autoComplete="email"
                        />
                        {errors.email && <div className={styles.formError}>{errors.email}</div>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            className={styles.formInput}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            autoComplete="current-password"
                        />
                        {errors.password && <div className={styles.formError}>{errors.password}</div>}
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.formSubmit}`}>
                        Accedi
                    </button>
                </form>

                <a href="#" className={styles.forgotPassword}>
                    Password dimenticata?
                </a>
            </div>
        </div>
    );
}
