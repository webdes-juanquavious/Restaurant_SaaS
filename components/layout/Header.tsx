'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase';

/* Navigation configs per role */
const basePublicNav = [
  { href: '/', label: 'Home' },
  { href: '/prenota', label: 'Prenota' },
  { href: '/menu', label: 'Menu' },
  { href: '/contatto', label: 'Contatto' },
  { href: '/login', label: 'Login' },
];

const adminNav = [
  { href: '/admin', label: 'PERSONALE' },
  { href: '/admin/tavoli', label: 'TAVOLI' },
  { href: '/admin/menu', label: 'MENU' },
  { href: '/admin/informazioni', label: 'INFO & EXTRA' },
  { href: '/admin/contabilita', label: 'CONTABILITA' },
];

const dipendentiNav = [
  { href: '/dipendenti/prenotazioni', label: 'Prenotazioni' },
  { href: '/dipendenti', label: 'Tavoli' },
  { href: '/dipendenti/comande', label: 'Comande' },
  { href: '/dipendenti/contabilita', label: 'Contabilità' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [lavoraConNoiAttivo, setLavoraConNoiAttivo] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('ristorante_info').select('extra_settings').single();
      if (data?.extra_settings) {
        setLavoraConNoiAttivo(data.extra_settings.lavoraConNoi !== false);
      }
    };
    fetchSettings();
  }, []);

  /* Determine role from user metadata */
  const userRole = user?.user_metadata?.role;
  const isAdmin = userRole === 'admin' || pathname.startsWith('/admin');
  const isDipendente = (['cameriere', 'cuoco', 'cassiere', 'barman', 'pizzaiolo'].includes(userRole)) || pathname.startsWith('/dipendenti');
  const isLoggedIn = !!user;

  const publicNav = lavoraConNoiAttivo
    ? [...basePublicNav.slice(0, 4), { href: '/lavora-con-noi', label: 'Lavora con Noi' }, ...basePublicNav.slice(4)]
    : basePublicNav;

  const navItems = isAdmin ? adminNav : isDipendente ? dipendentiNav : publicNav;
  const userName = user?.user_metadata?.full_name || user?.email || '';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/dipendenti') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isLoggedIn ? styles.headerLoggedIn : ''}`}>
      <div className={styles.headerInner}>
        {/* Logo */}
        <Link href={isAdmin ? '/admin' : isDipendente ? '/dipendenti' : '/'} className={styles.logo}>
          <div className={styles.logoIcon}>🐟</div>
          <div>
            <span className={styles.logoText}>Mare Nostrum</span>
            <span className={styles.logoSubtext}>RISTORANTE DI PESCE</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}

          {/* User info & Logout for logged-in users */}
          {isLoggedIn && (
            <div className={styles.userSection}>
              <span className={styles.userBadge}>
                <span className={styles.userBadgeIcon}>{isAdmin ? '👤' : '🧑‍🍳'}</span>
                <span className={styles.userName}>{userName}</span>
              </span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Hamburger Button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`${styles.mobileNav} ${menuOpen ? styles.open : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.mobileNavLinkActive : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        {isLoggedIn && (
          <>
            <div className={styles.mobileUserInfo}>
              {isAdmin ? '👤' : '🧑‍🍳'} {userName}
            </div>
            <button
              className={styles.mobileLogoutBtn}
              onClick={() => { setMenuOpen(false); handleLogout(); }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
