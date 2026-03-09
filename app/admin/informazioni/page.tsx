'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase';


export default function AdminInformazioniPage() {
    const [info, setInfo] = useState({
        nome: 'Mare Nostrum',
        indirizzo: 'Via del Porto 42, 00100 Roma',
        telefono: '+39 06 1234 5678',
        email: 'info@marenostrum.it',
        descrizione: 'La tradizione del mare incontra l\'innovazione culinaria.',
        facebook: 'https://facebook.com/marenostrum',
        instagram: 'https://instagram.com/marenostrum',
        tiktok: 'https://tiktok.com/@marenostrum',
        googleMapsLink: 'https://goo.gl/maps/example',
        googleMapsEmbed: '<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    });

    // Impostazioni Generali
    const [tema, setTema] = useState('dark');

    // Nuove Impostazioni Extra (Prenotazioni & Costi)
    const [extraSettings, setExtraSettings] = useState({
        durataDefault: 90,        // minuti
        penaleNoShow: 15,         // minuti
        isPenaleAttiva: true,
        supplementoExtra: 5,      // euro
        isSupplementoAttivo: true,
        costoCoperto: 2.50,       // euro
        whatsappPublic: false,    // true = click telefono apre WhatsApp per utenti
        telefonoWhatsapp: '',     // Numero specifico per whatsapp
        lavoraConNoi: true,       // Abilitazione pagina Lavora con noi
        ordinaOnline: true,       // Abilitazione ordini menu
        allowManualDurationOverride: false // Se vero, permette al cameriere di cambiare la durata manualmente
    });

    const [orari, setOrari] = useState<Record<string, any>>({
        lunedi: { tipo: 'pausa-pranzo', f1: { a: '12:00', c: '15:00', ok: true }, f2: { a: '19:00', c: '23:30', ok: true } },
        martedi: { tipo: 'pausa-pranzo', f1: { a: '12:00', c: '15:00', ok: true }, f2: { a: '19:00', c: '23:30', ok: true } },
        mercoledi: { tipo: 'pausa-pranzo', f1: { a: '12:00', c: '15:00', ok: true }, f2: { a: '19:00', c: '23:30', ok: true } },
        giovedi: { tipo: 'pausa-pranzo', f1: { a: '12:00', c: '15:00', ok: true }, f2: { a: '19:00', c: '23:30', ok: true } },
        venerdi: { tipo: 'pausa-pranzo', f1: { a: '12:00', c: '15:00', ok: true }, f2: { a: '19:00', c: '00:30', ok: true } },
        sabato: { tipo: 'pausa-pranzo', f1: { a: '12:00', c: '15:00', ok: true }, f2: { a: '19:00', c: '01:00', ok: true } },
        domenica: { tipo: 'continuato', f1: { a: '12:00', c: '23:00', ok: true }, f2: { a: '', c: '', ok: false } },
    });

    const [dbId, setDbId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [activeSubTab, setActiveSubTab] = useState<'info' | 'orari' | 'extra'>('info');
    const supabase = createClient();

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchInfo = useCallback(async () => {
        const { data, error } = await supabase.from('ristorante_info').select('*').single();
        if (error) { console.error('Fetch error:', error); return; }
        if (data) {
            setDbId(data.id);
            setInfo({
                nome: data.nome ?? '',
                indirizzo: data.indirizzo ?? '',
                telefono: data.telefono ?? '',
                email: data.email ?? '',
                descrizione: data.descrizione ?? '',
                facebook: data.facebook ?? '',
                instagram: data.instagram ?? '',
                tiktok: data.tiktok ?? '',
                googleMapsLink: data.maps_link ?? '',
                googleMapsEmbed: data.maps_embed ?? '',
            });
            if (data.orari) setOrari(data.orari);
            if (data.extra_settings) {
                setExtraSettings(data.extra_settings);
                if (data.extra_settings.tema) {
                    setTema(data.extra_settings.tema);
                    document.documentElement.setAttribute('data-theme', data.extra_settings.tema);
                }
            }
        }
    }, [supabase]);

    useEffect(() => { fetchInfo(); }, [fetchInfo]);

    const handleSaveGeneral = async () => {
        if (!dbId) { showToast('ID record non trovato. Ricarica la pagina.', false); return; }
        const { error } = await supabase.from('ristorante_info').update({
            nome: info.nome,
            indirizzo: info.indirizzo,
            telefono: info.telefono,
            email: info.email,
            descrizione: info.descrizione,
            facebook: info.facebook,
            instagram: info.instagram,
            tiktok: info.tiktok,
            maps_link: info.googleMapsLink,
            maps_embed: info.googleMapsEmbed,
        }).eq('id', dbId);

        if (error) { console.error('Save general error:', error); showToast('Errore: ' + error.message, false); }
        else showToast('✅ Dati base salvati!', true);
    };

    const handleSaveOrari = async () => {
        if (!dbId) { showToast('ID record non trovato. Ricarica la pagina.', false); return; }
        console.log('Saving orari with dbId:', dbId, orari);
        const { error, data } = await supabase
            .from('ristorante_info')
            .update({ orari })
            .eq('id', dbId)
            .select();
        console.log('Save orari result:', { error, data });
        if (error) { console.error('Save orari error:', error); showToast('Errore orari: ' + error.message, false); }
        else showToast('✅ Orari salvati! Aggiorna il sito per vedere i cambiamenti.', true);
    };

    const handleSaveExtra = async () => {
        if (!dbId) { showToast('ID record non trovato. Ricarica la pagina.', false); return; }
        const { error } = await supabase.from('ristorante_info').update({
            extra_settings: extraSettings,
        }).eq('id', dbId);
        if (error) { console.error('Save extra error:', error); showToast('Errore impostazioni: ' + error.message, false); }
        else showToast('✅ Impostazioni salvate!', true);
    };

    const handleThemeChange = async (newTheme: string) => {
        setTema(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);

        // Persist to DB
        if (dbId) {
            const updated = { ...extraSettings, tema: newTheme };
            setExtraSettings(updated);
            const { error } = await supabase.from('ristorante_info').update({
                extra_settings: updated
            }).eq('id', dbId);

            if (error) showToast('Errore salvataggio tema: ' + error.message, false);
            else showToast('✅ Tema salvato!', true);
        }
    };

    const themes = [
        { value: 'dark', label: 'Scuro', preview: '#0d0d0d', text: '#f5f5f5' },
        { value: 'light', label: 'Chiaro', preview: '#fafafa', text: '#1a1a1a' },
        { value: 'sea-green', label: 'Verde Marino', preview: '#0b1f1f', text: '#e8e0d4' },
        { value: 'warm-orange', label: 'Arancio Caldo', preview: '#fdf6ee', text: '#3e2014' },
    ];

    const giorniSettimana = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica'];
    const giorniLabel: Record<string, string> = {
        lunedi: 'Lunedì', martedi: 'Martedì', mercoledi: 'Mercoledì',
        giovedi: 'Giovedì', venerdi: 'Venerdì', sabato: 'Sabato', domenica: 'Domenica',
    };

    /* Helper per creare un bel toggle button */
    const ToggleBtn = ({ checked, onChange, label, desc }: { checked: boolean, onChange: () => void, label: string, desc?: string }) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
            <button
                onClick={onChange}
                style={{
                    width: '50px', height: '26px', borderRadius: '13px',
                    background: checked ? 'var(--color-success)' : 'var(--border-color)',
                    position: 'relative', border: 'none', cursor: 'pointer',
                    transition: 'background 0.3s ease', flexShrink: 0, marginTop: '2px'
                }}
            >
                <span style={{
                    position: 'absolute', top: '2px', left: checked ? '26px' : '2px',
                    width: '22px', height: '22px', borderRadius: '11px',
                    background: '#fff', transition: 'left 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
            </button>
            <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{label}</div>
                {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>}
            </div>
        </div>
    );

    const NumberInput = ({ label, value, onChange, unit, desc }: { label: string, value: number, onChange: (v: number) => void, unit: string, desc?: string }) => (
        <div style={{ marginBottom: '20px', maxWidth: '300px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {label}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                    type="number" value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    style={{ flex: 1 }} step={unit === '€' ? '0.5' : '5'}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{unit}</span>
            </div>
            {desc && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>{desc}</div>}
        </div>
    );

    return (
        <>
            {/* Toast notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
                    padding: '14px 20px', borderRadius: 'var(--radius-md)',
                    background: toast.ok ? 'rgba(76,175,80,0.15)' : 'rgba(239,83,80,0.15)',
                    border: `1px solid ${toast.ok ? 'var(--color-success)' : 'var(--color-error)'}`,
                    color: toast.ok ? 'var(--color-success)' : 'var(--color-error)',
                    fontWeight: 600, fontSize: '0.9rem',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    animation: 'fadeInUp 0.3s ease',
                }}>
                    {toast.msg}
                </div>
            )}

            <h2 className={styles.pageTitle}>Info & Extra</h2>
            <p className={styles.pageSubtitle}>Modifica le informazioni e i parametri di sistema del ristorante.</p>

            {/* Sub-Tabs Navigation */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                {[
                    { id: 'info', label: 'Info Ristorante', desc: 'Modifica le informazioni di base del ristorante' },
                    { id: 'orari', label: 'Orari di apertura', desc: 'Modifica gli orari di apertura' },
                    { id: 'extra', label: 'Funzionalità extra', desc: 'Gestione funzionalità extra' }
                ].map((tab) => (
                    <div
                        key={tab.id}
                        className={`${styles.tabHeaderBox} ${activeSubTab === tab.id ? styles.tabHeaderBoxActive : ''}`}
                        onClick={() => setActiveSubTab(tab.id as any)}
                        style={{
                            flex: 1,
                            cursor: 'pointer',
                            padding: '24px',
                            borderRadius: 'var(--radius-lg)',
                            background: activeSubTab === tab.id ? 'rgba(var(--color-primary-rgb), 0.1)' : 'rgba(255,255,255,0.02)',
                            border: activeSubTab === tab.id ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <h4 style={{ fontSize: '1.2rem', margin: 0, color: activeSubTab === tab.id ? 'var(--color-primary)' : 'inherit' }}>{tab.label}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>{tab.desc}</p>
                    </div>
                ))}
            </div>

            {/* Panel 1: Info Ristorante + Tema */}
            {activeSubTab === 'info' && (
                <>
                    <div className={styles.formPanel} style={{ marginBottom: '24px' }}>
                        <h3 className={styles.formPanelTitle}>Informazioni di Base</h3>
                        <div className={styles.formRow}>
                            <div>
                                <label className={styles.inputLabel}>Nome Ristorante</label>
                                <input type="text" value={info.nome} onChange={(e) => setInfo({ ...info, nome: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className={styles.inputLabel}>Indirizzo</label>
                                <input type="text" value={info.indirizzo} onChange={(e) => setInfo({ ...info, indirizzo: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label className={styles.inputLabel}>Telefono</label>
                                <input type="tel" value={info.telefono} onChange={(e) => setInfo({ ...info, telefono: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className={styles.inputLabel}>Email</label>
                                <input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label className={styles.inputLabel}>Descrizione</label>
                            <textarea value={info.descrizione} onChange={(e) => setInfo({ ...info, descrizione: e.target.value })} rows={3} style={{ width: '100%' }} />
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label className={styles.inputLabel}>Facebook URL</label>
                                <input type="url" value={info.facebook} onChange={(e) => setInfo({ ...info, facebook: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className={styles.inputLabel}>Instagram URL</label>
                                <input type="url" value={info.instagram} onChange={(e) => setInfo({ ...info, instagram: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className={styles.inputLabel}>TikTok URL</label>
                                <input type="url" value={info.tiktok} onChange={(e) => setInfo({ ...info, tiktok: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div style={{ flex: 1 }}>
                                <label className={styles.inputLabel}>Google Maps Link</label>
                                <input type="url" value={info.googleMapsLink} onChange={(e) => setInfo({ ...info, googleMapsLink: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label className={styles.inputLabel}>Embed Google Maps (Iframe)</label>
                            <textarea
                                value={info.googleMapsEmbed}
                                onChange={(e) => setInfo({ ...info, googleMapsEmbed: e.target.value })}
                                rows={2}
                                style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'monospace' }}
                                placeholder='<iframe src="..." ...></iframe>'
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
                            <button className="btn btn-primary" style={{ padding: '10px 24px' }} onClick={handleSaveGeneral}>Salva Informazioni</button>
                        </div>
                    </div>

                    <div className={styles.formPanel}>
                        <h3 className={styles.formPanelTitle}>Tema Colore</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {themes.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => handleThemeChange(t.value)}
                                    style={{
                                        padding: '24px 16px', borderRadius: 'var(--radius-md)',
                                        border: tema === t.value ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                                        background: t.preview, color: t.text, cursor: 'pointer', textAlign: 'center',
                                        fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s ease',
                                        boxShadow: tema === t.value ? 'var(--shadow-glow)' : 'none',
                                        opacity: tema === t.value ? 1 : 0.8
                                    }}
                                >
                                    {t.label}
                                    {tema === t.value && <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '8px', color: 'var(--color-primary)' }}>✓ Attivo</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Panel 2: Orari */}
            {activeSubTab === 'orari' && (
                <div className={styles.formPanel} style={{ marginBottom: '24px' }}>
                    <h3 className={styles.formPanelTitle}>Orari di Apertura</h3>

                    {/* Intestazione Colonne */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) minmax(130px, 1.2fr) minmax(280px, 2fr) minmax(280px, 2fr)', gap: '15px', marginBottom: '16px', padding: '0 16px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Giorno</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categoria</div>
                        <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', lineHeight: 1.2 }}>Orari mattina<br />(servizio pranzo)</div>
                        <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', lineHeight: 1.2 }}>Orari pomeriggio<br />(servizio cena)</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {giorniSettimana.map((giorno) => {
                            const sched = orari[giorno];
                            const isClosed = sched.tipo === 'chiuso';
                            const isContinuo = sched.tipo === 'continuato';

                            return (
                                <div
                                    key={giorno}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'minmax(100px, 1fr) minmax(130px, 1.2fr) minmax(280px, 2fr) minmax(280px, 2fr)',
                                        gap: '15px',
                                        alignItems: 'center',
                                        padding: '10px 16px',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-color)',
                                        opacity: isClosed ? 0.5 : 1
                                    }}
                                >
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{giorniLabel[giorno]}</span>

                                    <select
                                        value={sched.tipo}
                                        onChange={(e) => setOrari({ ...orari, [giorno]: { ...sched, tipo: e.target.value } })}
                                        style={{
                                            padding: '6px 8px', fontSize: '0.8rem', fontWeight: 600,
                                            color: isClosed ? 'var(--color-error)' : 'var(--color-primary)',
                                            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px'
                                        }}
                                    >
                                        <option value="chiuso">chiuso</option>
                                        <option value="pausa-pranzo">pausa pranzo</option>
                                        <option value="continuato">continuato</option>
                                    </select>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                        {!isClosed && (
                                            <>
                                                <input
                                                    type="time" value={sched.f1.a} disabled={!sched.f1.ok}
                                                    onChange={(e) => setOrari({ ...orari, [giorno]: { ...sched, f1: { ...sched.f1, a: e.target.value } } })}
                                                    style={{ width: '85px', padding: '4px', fontSize: '0.8rem', textAlign: 'center' }}
                                                />
                                                <span style={{ color: 'var(--text-muted)' }}>–</span>
                                                <input
                                                    type="time" value={sched.f1.c} disabled={!sched.f1.ok}
                                                    onChange={(e) => setOrari({ ...orari, [giorno]: { ...sched, f1: { ...sched.f1, c: e.target.value } } })}
                                                    style={{ width: '85px', padding: '4px', fontSize: '0.8rem', textAlign: 'center' }}
                                                />
                                                {!isContinuo && (
                                                    <button
                                                        onClick={() => setOrari({ ...orari, [giorno]: { ...sched, f1: { ...sched.f1, ok: !sched.f1.ok } } })}
                                                        style={{
                                                            width: '32px', height: '18px', borderRadius: '10px',
                                                            background: sched.f1.ok ? 'var(--color-success)' : 'var(--border-color)',
                                                            border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0
                                                        }}
                                                    >
                                                        <div style={{ position: 'absolute', top: '2px', left: sched.f1.ok ? '16px' : '2px', width: '14px', height: '14px', background: '#fff', borderRadius: '50%', transition: 'all 0.2s' }} />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                        {sched.tipo === 'pausa-pranzo' && (
                                            <>
                                                <input
                                                    type="time" value={sched.f2.a} disabled={!sched.f2.ok}
                                                    onChange={(e) => setOrari({ ...orari, [giorno]: { ...sched, f2: { ...sched.f2, a: e.target.value } } })}
                                                    style={{ width: '85px', padding: '4px', fontSize: '0.8rem', textAlign: 'center' }}
                                                />
                                                <span style={{ color: 'var(--text-muted)' }}>–</span>
                                                <input
                                                    type="time" value={sched.f2.c} disabled={!sched.f2.ok}
                                                    onChange={(e) => setOrari({ ...orari, [giorno]: { ...sched, f2: { ...sched.f2, c: e.target.value } } })}
                                                    style={{ width: '85px', padding: '4px', fontSize: '0.8rem', textAlign: 'center' }}
                                                />
                                                <button
                                                    onClick={() => setOrari({ ...orari, [giorno]: { ...sched, f2: { ...sched.f2, ok: !sched.f2.ok } } })}
                                                    style={{
                                                        width: '32px', height: '18px', borderRadius: '10px',
                                                        background: sched.f2.ok ? 'var(--color-success)' : 'var(--border-color)',
                                                        border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0
                                                    }}
                                                >
                                                    <div style={{ position: 'absolute', top: '2px', left: sched.f2.ok ? '16px' : '2px', width: '14px', height: '14px', background: '#fff', borderRadius: '50%', transition: 'all 0.2s' }} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '24px' }}>
                        <button className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }} onClick={handleSaveOrari}>
                            Salva Orari
                        </button>
                    </div>
                </div>
            )}

            {/* Panel 3: Funzionalità Extra */}
            {activeSubTab === 'extra' && (
                <div className={styles.formPanel}>
                    <h3 className={styles.formPanelTitle}>Funzionalità Extra</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {/* Regole Tavoli */}
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Regole Tavoli</h4>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                    Durata Default Prenotazione
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                        <input
                                            type="number" value={extraSettings.durataDefault}
                                            onChange={(v) => setExtraSettings({ ...extraSettings, durataDefault: parseInt(v.target.value) || 0 })}
                                            style={{ width: '80px' }}
                                        />
                                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>min</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            onClick={() => setExtraSettings({ ...extraSettings, allowManualDurationOverride: !extraSettings.allowManualDurationOverride })}
                                            style={{
                                                width: '36px', height: '18px', borderRadius: '9px',
                                                background: extraSettings.allowManualDurationOverride ? 'var(--color-success)' : 'var(--border-color)',
                                                position: 'relative', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                                            }}
                                        >
                                            <span style={{
                                                position: 'absolute', top: '2px', left: extraSettings.allowManualDurationOverride ? '20px' : '2px',
                                                width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'all 0.3s'
                                            }} />
                                        </button>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>Modifica Manuale</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                                    Tempo standard assegnato a un tavolo prenotato online.<br />
                                    <span style={{ color: extraSettings.allowManualDurationOverride ? 'var(--color-success)' : 'inherit', fontWeight: extraSettings.allowManualDurationOverride ? 600 : 400 }}>
                                        {extraSettings.allowManualDurationOverride
                                            ? '✓ Il cameriere potrà modificare il tempo massimo dal lato prenotazione.'
                                            : 'Se il pulsante è attivo, si può modificare il tempo massimo dal lato di prenotazione.'}
                                    </span>
                                </div>
                            </div>

                            <ToggleBtn
                                checked={extraSettings.isPenaleAttiva}
                                onChange={() => setExtraSettings({ ...extraSettings, isPenaleAttiva: !extraSettings.isPenaleAttiva })}
                                label="Attiva Penale No-Show (Ritardo)"
                                desc="Ritardo massimo consentito prima di perdere il tavolo."
                            />
                            {extraSettings.isPenaleAttiva && (
                                <div style={{ paddingLeft: '24px', borderLeft: '2px solid var(--color-primary)', marginLeft: '12px', marginBottom: '20px' }}>
                                    <NumberInput
                                        label="Ritardo Massimo Consentito"
                                        value={extraSettings.penaleNoShow}
                                        onChange={(v) => setExtraSettings({ ...extraSettings, penaleNoShow: v })}
                                        unit="min"
                                    />
                                </div>
                            )}

                            <ToggleBtn
                                checked={extraSettings.isSupplementoAttivo}
                                onChange={() => setExtraSettings({ ...extraSettings, isSupplementoAttivo: !extraSettings.isSupplementoAttivo })}
                                label="Supplemento Tempo Extra"
                                desc="Costo extra se il cliente prenota per un tempo superiore allo standard."
                            />
                            {extraSettings.isSupplementoAttivo && (
                                <div style={{ paddingLeft: '24px', borderLeft: '2px solid var(--color-primary)', marginLeft: '12px', marginBottom: '20px' }}>
                                    <NumberInput
                                        label="Costo Supplemento"
                                        value={extraSettings.supplementoExtra}
                                        onChange={(v) => setExtraSettings({ ...extraSettings, supplementoExtra: v })}
                                        unit="€"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Costi & Cassa */}
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Costi & Cassa</h4>
                            <NumberInput
                                label="Costo Coperto (a persona)"
                                value={extraSettings.costoCoperto}
                                onChange={(v) => setExtraSettings({ ...extraSettings, costoCoperto: v })}
                                unit="€"
                                desc="Aggiunto automaticamente alla chiusura in base al numero di persone."
                            />
                        </div>

                        {/* Funzionalità Extra */}
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Impostazioni Extra</h4>
                            <ToggleBtn
                                checked={extraSettings.ordinaOnline}
                                onChange={() => setExtraSettings({ ...extraSettings, ordinaOnline: !extraSettings.ordinaOnline })}
                                label="Ordina Online Menu"
                                desc={extraSettings.ordinaOnline ? 'Attivo — i clienti possono ordinare online' : 'Disattivato — il menu è solo consultabile'}
                            />
                            <ToggleBtn
                                checked={extraSettings.whatsappPublic}
                                onChange={() => setExtraSettings({ ...extraSettings, whatsappPublic: !extraSettings.whatsappPublic })}
                                label="Contatto WhatsApp"
                                desc="Click sul telefono apre WhatsApp."
                            />
                            {extraSettings.whatsappPublic && (
                                <div style={{ marginLeft: '12px', paddingLeft: '24px', borderLeft: '2px solid var(--color-primary)', marginBottom: '20px' }}>
                                    <label className={styles.inputLabel}>Numero WhatsApp (con prefisso)</label>
                                    <input
                                        type="text"
                                        value={extraSettings.telefonoWhatsapp || ''}
                                        onChange={(e) => setExtraSettings({ ...extraSettings, telefonoWhatsapp: e.target.value })}
                                        placeholder="+39 333 1234567"
                                        style={{ width: '100%', maxWidth: '250px' }}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Inserisci il numero WhatsApp del ristorante.</div>
                                </div>
                            )}
                            <ToggleBtn
                                checked={extraSettings.lavoraConNoi}
                                onChange={() => setExtraSettings({ ...extraSettings, lavoraConNoi: !extraSettings.lavoraConNoi })}
                                label="Pagina Lavora con noi"
                                desc="Se attivo, mostra le offerte di lavoro sul sito pubblico."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '32px' }}>
                        <button className="btn btn-primary" style={{ padding: '12px 32px' }} onClick={handleSaveExtra}>Salva Funzionalità</button>
                    </div>
                </div>
            )}
        </>
    );
}
