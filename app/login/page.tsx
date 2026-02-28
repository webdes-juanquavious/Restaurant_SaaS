'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loginError, setLoginError] = useState('');

    const { session } = useAuth();
    const supabase = createClientComponentClient();

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!credentials.email.trim()) errs.email = 'Email obbligatoria';
        if (!credentials.password) errs.password = 'Password obbligatoria';
        return errs;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoginError('');
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});

        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            setLoginError(error.message);
            return;
        }

        if (data.session) {
            const role = data.session.user.user_metadata.role;
            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dipendenti');
            }
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
