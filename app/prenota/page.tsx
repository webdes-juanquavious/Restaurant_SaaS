'use client';

import { useState, FormEvent, useMemo } from 'react';
import styles from './prenota.module.css';

/* ---- Mock Settings / Data ---- */
const TAVOLI_MOCK = [
    { id: 1, posti: 4, type: 'standard' },
    { id: 2, posti: 6, type: 'standard' },
    { id: 3, posti: 2, type: 'standard' },
    { id: 4, posti: 8, type: 'standard' },
    { id: 5, posti: 4, type: 'standard' },
    { id: 6, posti: 2, type: 'standard' },
    { id: 7, posti: 6, type: 'standard' },
]; // Totale capienza = 32

const PRENOTAZIONI_MOCK = [
    // Prenotazioni di oggi a vari orari
    { id: 101, data: new Date().toISOString().split('T')[0], orario: '20:00', persone: 8 },
    { id: 102, data: new Date().toISOString().split('T')[0], orario: '20:00', persone: 4 }, // 12 persone alle 20 (giallo se capienza=32)
    { id: 103, data: new Date().toISOString().split('T')[0], orario: '21:00', persone: 26 }, // 26 alle 21:00 (rosso)
];

const ORARI_CENA = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];
/* 
    Logica Colori (% occupazione della capienza max):
    - Verde: < 40%
    - Giallo: 40% - 75%
    - Rosso: > 75%
    - Grigio/Barrato: 100% (o non ci sono tavoli adatti)
*/

export default function PrenotaPage() {
    const todayStr = new Date().toISOString().split('T')[0];

    const [contactMethod, setContactMethod] = useState<'email' | 'telefono'>('email');
    const [showConfirm, setShowConfirm] = useState(false);
    
    // Form fields
    const [formData, setFormData] = useState({
        persone: '2',
        nome: '',
        contatto: '',
        data: todayStr,
        orario: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const capacitaTotale = TAVOLI_MOCK.reduce((sum, t) => sum + t.posti, 0);

    // Helpers
    const getPrenotazioniPerFascia = (dataReq: string, orarioReq: string) => {
        // In un db reale controlleremmo la durata della prenotazione. 
        // Per semplicità qui simuliamo il conteggio esatto per quello slot.
        return PRENOTAZIONI_MOCK.filter(p => p.data === dataReq && p.orario === orarioReq)
                                .reduce((sum, p) => sum + p.persone, 0);
    };

    const getOccupazioneSlot = (dataReq: string, orarioReq: string) => {
        const occupati = getPrenotazioniPerFascia(dataReq, orarioReq);
        const percent = (occupati / capacitaTotale) * 100;
        
        // Verifica disponibilità tavolo adatto
        // Esempio: se servono 4 posti, ma sono rimasti solo tavoli da 2, l'algoritmo reale bloccherebbe.
        // Qui ci basiamo solo sulla percentuale per il calcolo semaforico
        return percent;
    };

    const getStatusColorClass = (percent: number) => {
        if (percent >= 100) return styles.slotFull;
        if (percent >= 75) return styles.slotHigh;
        if (percent >= 40) return styles.slotMedium;
        return styles.slotLow;
    };

    const getStatusText = (percent: number) => {
        if (percent >= 100) return 'Esaurito';
        if (percent >= 75) return 'Quasi Pieno';
        if (percent >= 40) return 'Mezzo Pieno';
        return 'Ampia Disp.';
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!formData.nome.trim()) errs.nome = 'Il nome è obbligatorio';
        if (!formData.contatto.trim()) errs.contatto = `Inserisci la tua ${contactMethod}`;
        if (contactMethod === 'email' && formData.contatto && !/\S+@\S+\.\S+/.test(formData.contatto)) {
            errs.contatto = 'Email non valida';
        }
        if (!formData.data) errs.data = 'Seleziona una data';
        if (!formData.orario) errs.orario = 'Seleziona un orario';
        
        // Check availability strictly
        if (formData.data && formData.orario) {
            const perc = getOccupazioneSlot(formData.data, formData.orario);
            const reqPersone = parseInt(formData.persone);
            const occAttuali = getPrenotazioniPerFascia(formData.data, formData.orario);
            if (occAttuali + reqPersone > capacitaTotale) {
                errs.orario = 'Non c\'è sufficiente capienza per quest\'orario. Scegli un altro slot o riduci le persone.';
            }
        }
        return errs;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setShowConfirm(true);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
        // Se cambio data, reset orario per forzare la riconsiderazione colore
        if (field === 'data') {
            setFormData((prev) => ({ ...prev, orario: '' }));
        }
    };

    const dateSelected = new Date(formData.data);
    const dateFormatted = dateSelected.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className={styles.prenotaPage}>
            <div className={styles.prenotaHeader}>
                <div className={styles.prenotaHeaderIcon}>🍽️</div>
                <h1 className="section-title">Prenota il Tuo Tavolo</h1>
                <div className="section-divider" />
                <p className="section-subtitle">
                    Riserva il tuo posto monitorando la disponibilità in tempo reale.
                </p>
            </div>

            <div className={styles.prenotaContent}>
                {/* Form Col */}
                <form className={styles.prenotaForm} onSubmit={handleSubmit} noValidate>
                    <div style={{ marginBottom: '24px', fontWeight: 600, color: 'var(--color-primary)', fontSize: '1.2rem', textTransform: 'capitalize' }}>
                        📅 {dateFormatted}
                    </div>

                    <div className={styles.formRow}>
                        {/* Data */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Scegli la Data</label>
                            <input
                                type="date"
                                className={styles.formInput}
                                value={formData.data}
                                onChange={(e) => handleChange('data', e.target.value)}
                                min={todayStr}
                            />
                            {errors.data && <div className={styles.formError}>{errors.data}</div>}
                        </div>

                        {/* Numero Persone */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Persone</label>
                            <select
                                className={styles.formSelect}
                                value={formData.persone}
                                onChange={(e) => handleChange('persone', e.target.value)}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                                    <option key={n} value={String(n)}>
                                        {n} {n === 1 ? 'persona' : 'persone'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* GRIGLIA ORARI CROMATICA */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Disponibilità Oraria</label>
                        <div className={styles.legendBar}>
                            <span className={styles.legendItem}><span className={styles.dotLow}></span> Libero</span>
                            <span className={styles.legendItem}><span className={styles.dotMedium}></span> In esaurimento</span>
                            <span className={styles.legendItem}><span className={styles.dotHigh}></span> Critico</span>
                        </div>
                        <div className={styles.timeSlotsGrid}>
                            {ORARI_CENA.map(orario => {
                                const percent = getOccupazioneSlot(formData.data, orario);
                                const colorClass = getStatusColorClass(percent);
                                const isFull = percent >= 100 || (getPrenotazioniPerFascia(formData.data, orario) + parseInt(formData.persone) > capacitaTotale);
                                
                                return (
                                    <button
                                        key={orario}
                                        type="button"
                                        disabled={isFull}
                                        className={`${styles.timeSlotBtn} ${colorClass} ${formData.orario === orario ? styles.timeSlotActive : ''} ${isFull ? styles.timeSlotDisabled : ''}`}
                                        onClick={() => handleChange('orario', orario)}
                                    >
                                        <div className={styles.timeSlotTime}>{orario}</div>
                                        <div className={styles.timeSlotStatus}>{isFull ? 'Esaurito' : getStatusText(percent)}</div>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.orario && <div className={styles.formError}>{errors.orario}</div>}
                    </div>

                    {/* Nome */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Nome Completo</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Mario Rossi"
                            value={formData.nome}
                            onChange={(e) => handleChange('nome', e.target.value)}
                        />
                        {errors.nome && <div className={styles.formError}>{errors.nome}</div>}
                    </div>

                    {/* Contact Tabs */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Recapito (Prenotazione online)</label>
                        <div className={styles.contactTabs}>
                            <button
                                type="button"
                                className={`${styles.contactTab} ${contactMethod === 'email' ? styles.contactTabActive : ''}`}
                                onClick={() => setContactMethod('email')}
                            >
                                ✉️ Email
                            </button>
                            <button
                                type="button"
                                className={`${styles.contactTab} ${contactMethod === 'telefono' ? styles.contactTabActive : ''}`}
                                onClick={() => setContactMethod('telefono')}
                            >
                                📞 Telefono
                            </button>
                        </div>
                        <input
                            type={contactMethod === 'email' ? 'email' : 'tel'}
                            className={styles.formInput}
                            placeholder={contactMethod === 'email' ? 'mario@email.com' : '+39 333 1234567'}
                            value={formData.contatto}
                            onChange={(e) => handleChange('contatto', e.target.value)}
                        />
                        {errors.contatto && <div className={styles.formError}>{errors.contatto}</div>}
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.formSubmit}`}>
                        Conferma Prenotazione
                    </button>
                </form>

                {/* Info Panel */}
                <div className={styles.prenotaInfo}>
                    <div className={`${styles.infoCard} glass-panel`}>
                        <div className={styles.infoCardIcon}>📋</div>
                        <div>
                            <div className={styles.infoCardTitle}>Sistema Smart</div>
                            <p className={styles.infoCardText}>
                                Il nostro sistema calcola in tempo reale la metratura e la disponibilità tavoli.
                                Guarda i colori per capire i momenti più tranquilli!
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.infoCard} glass-panel`}>
                        <div className={styles.infoCardIcon}>⏰</div>
                        <div>
                            <div className={styles.infoCardTitle}>Tempistiche</div>
                            <p className={styles.infoCardText}>
                                La prenotazione online ti riserva il tavolo per 90 minuti. Se hai bisogno di più tempo, specificalo allo staff. In caso di No-Show, il tavolo verrà liberato dopo 15 minuti di ritardo.
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.infoCard} glass-panel`}>
                        <div className={styles.infoCardIcon}>✨</div>
                        <div>
                            <div className={styles.infoCardTitle}>Richieste Speciali?</div>
                            <p className={styles.infoCardText}>
                                Hai allergie o vuoi festeggiare un traguardo importante? Faccelo sapere quando ti ricontatteremo e prepareremo lo spazio perfetto.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setShowConfirm(false)} />
                    <div className={styles.modalContent}>
                        <div className={styles.modalIcon}>✅</div>
                        <h3 className={styles.modalTitle}>Richiesta Ricevuta!</h3>
                        <p className={styles.modalText}>
                            <strong>{formData.nome}</strong>, la tua richiesta per{' '}
                            <strong>{formData.persone} {parseInt(formData.persone) === 1 ? 'persona' : 'persone'}</strong>
                        </p>
                        <div style={{ margin: '16px 0', padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary)' }}>{formData.orario}</div>
                            <div style={{ textTransform: 'capitalize' }}>{dateFormatted}</div>
                        </div>
                        <p className={styles.modalText}>
                            Ti abbiamo inviato un riepilogo su <strong>{formData.contatto}</strong>.
                        </p>
                        <button
                            className={`btn btn-primary ${styles.modalClose}`}
                            onClick={() => setShowConfirm(false)}
                            style={{ width: '100%', marginTop: '24px' }}
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
