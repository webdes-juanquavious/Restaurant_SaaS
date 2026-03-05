'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../admin.module.css';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';

interface MenuItem {
    id: string;
    nome: string;
    categoria: string;
    prezzo: number;
    descrizione: string;
    descrizione_home?: string;
    allergeni?: string;
    mostra_in_home: boolean;
    image_url?: string;
    emoji_fallback: string;
    is_active: boolean;
}

const categories = ['Antipasti', 'Primi', 'Secondi', 'Contorni', 'Dolci', 'Bevande'];
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' };

export default function AdminMenuPage() {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [editModal, setEditModal] = useState<MenuItem | null>(null);
    const [newDish, setNewDish] = useState({
        nome: '', categoria: 'Antipasti', prezzo: '', descrizione: '',
        descrizione_home: '', allergeni: '', mostra_in_home: false,
        image_url: '', emoji_fallback: '🍽️'
    });

    const supabase = createClient();

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchMenu = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('menu').select('*').order('categoria').order('nome');
        if (error) { console.error('Fetch menu error:', error); showToast('Errore caricamento menu: ' + error.message, false); }
        else setMenu(data || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchMenu(); }, [fetchMenu]);

    const handleAdd = async () => {
        if (!newDish.nome || !newDish.prezzo) { showToast('Nome e prezzo sono obbligatori.', false); return; }
        setSaving(true);
        const { error } = await supabase.from('menu').insert({
            nome: newDish.nome,
            categoria: newDish.categoria,
            prezzo: parseFloat(newDish.prezzo),
            descrizione: newDish.descrizione,
            descrizione_home: newDish.descrizione_home || null,
            allergeni: newDish.allergeni || null,
            mostra_in_home: newDish.mostra_in_home,
            image_url: newDish.image_url || null,
            emoji_fallback: newDish.emoji_fallback || '🍽️',
            is_active: true,
        });
        if (error) { showToast('Errore: ' + error.message, false); }
        else { showToast('✅ Piatto aggiunto!', true); setNewDish({ nome: '', categoria: 'Antipasti', prezzo: '', descrizione: '', descrizione_home: '', allergeni: '', mostra_in_home: false, image_url: '', emoji_fallback: '🍽️' }); fetchMenu(); }
        setSaving(false);
    };

    const toggleActive = async (item: MenuItem) => {
        const { error } = await supabase.from('menu').update({ is_active: !item.is_active }).eq('id', item.id);
        if (error) showToast('Errore: ' + error.message, false);
        else fetchMenu();
    };

    const toggleHome = async (item: MenuItem) => {
        const currentCount = menu.filter(m => m.mostra_in_home && m.id !== item.id).length;
        if (!item.mostra_in_home && currentCount >= 5) { showToast('Massimo 5 piatti in Home.', false); return; }
        const { error } = await supabase.from('menu').update({ mostra_in_home: !item.mostra_in_home }).eq('id', item.id);
        if (error) showToast('Errore: ' + error.message, false);
        else fetchMenu();
    };

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Eliminare "${nome}"?`)) return;
        const { error } = await supabase.from('menu').delete().eq('id', id);
        if (error) showToast('Errore eliminazione: ' + error.message, false);
        else { showToast('🗑️ Piatto eliminato.', true); fetchMenu(); }
    };

    const handleEditSave = async () => {
        if (!editModal) return;
        setSaving(true);
        const { error } = await supabase.from('menu').update({
            nome: editModal.nome,
            categoria: editModal.categoria,
            prezzo: editModal.prezzo,
            descrizione: editModal.descrizione,
            descrizione_home: editModal.descrizione_home || null,
            allergeni: editModal.allergeni || null,
            mostra_in_home: editModal.mostra_in_home,
            image_url: editModal.image_url || null,
            emoji_fallback: editModal.emoji_fallback || '🍽️',
            is_active: editModal.is_active,
        }).eq('id', editModal.id);
        if (error) showToast('Errore salvataggio: ' + error.message, false);
        else { showToast('✅ Piatto aggiornato!', true); setEditModal(null); fetchMenu(); }
        setSaving(false);
    };

    return (
        <>
            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999, padding: '14px 20px', borderRadius: 'var(--radius-md)', background: toast.ok ? 'rgba(76,175,80,0.15)' : 'rgba(239,83,80,0.15)', border: `1px solid ${toast.ok ? 'var(--color-success)' : 'var(--color-error)'}`, color: toast.ok ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600, fontSize: '0.9rem', backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                    {toast.msg}
                </div>
            )}

            <h2 className={styles.pageTitle}>Gestione Menu</h2>
            <p className={styles.pageSubtitle}>
                Aggiungi, modifica o sospendi i piatti. Tutti i dati vengono salvati su Supabase in tempo reale.
                <span style={{ marginLeft: '8px', color: 'var(--color-success)', fontWeight: 600 }}>● DB Live</span>
            </p>

            {/* Add Dish Form */}
            <div className={styles.formPanel}>
                <h3 className={styles.formPanelTitle}>Nuovo Piatto</h3>
                <div className={styles.formRow}>
                    <div>
                        <label style={labelStyle}>Nome Piatto</label>
                        <input type="text" placeholder="Nome del piatto" value={newDish.nome} onChange={(e) => setNewDish({ ...newDish, nome: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={labelStyle}>Categoria</label>
                        <select value={newDish.categoria} onChange={(e) => setNewDish({ ...newDish, categoria: e.target.value })} style={{ width: '100%' }}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Prezzo (€)</label>
                        <input type="number" placeholder="0.00" min="0" step="0.50" value={newDish.prezzo} onChange={(e) => setNewDish({ ...newDish, prezzo: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={labelStyle}>Emoji (Fallback)</label>
                        <input type="text" placeholder="🍽️" maxLength={2} value={newDish.emoji_fallback} onChange={(e) => setNewDish({ ...newDish, emoji_fallback: e.target.value })} style={{ width: '100%' }} />
                    </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>URL Immagine (opzionale)</label>
                    <input type="url" placeholder="https://..." value={newDish.image_url} onChange={(e) => setNewDish({ ...newDish, image_url: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Descrizione Ingredienti <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontWeight: 400 }}>(menu)</span></label>
                    <input type="text" placeholder="Breve descrizione con ingredienti" value={newDish.descrizione} onChange={(e) => setNewDish({ ...newDish, descrizione: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Descrizione Home Page <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontWeight: 400 }}>(presentazione)</span></label>
                    <input type="text" placeholder="Testo per la presentazione in Home" value={newDish.descrizione_home} onChange={(e) => setNewDish({ ...newDish, descrizione_home: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div className={styles.formRow}>
                    <div>
                        <label style={labelStyle}>Allergeni</label>
                        <input type="text" placeholder="Es: Glutine, Crostacei" value={newDish.allergeni} onChange={(e) => setNewDish({ ...newDish, allergeni: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={newDish.mostra_in_home} onChange={(e) => {
                                const count = menu.filter(m => m.mostra_in_home).length;
                                if (e.target.checked && count >= 5) { showToast('Massimo 5 piatti in Home.', false); return; }
                                setNewDish({ ...newDish, mostra_in_home: e.target.checked });
                            }} />
                            <span style={{ color: newDish.mostra_in_home ? 'var(--color-primary)' : 'inherit' }}>Mostra in Home (Max 5)</span>
                        </label>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleAdd} disabled={saving} style={{ marginTop: '16px' }}>
                    {saving ? 'Salvataggio...' : 'Aggiungi Piatto al DB'}
                </button>
            </div>

            {/* Menu Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Caricamento menu dal database...</div>
            ) : (
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Prezzo</th>
                            <th>Ingredienti</th>
                            <th>Home</th>
                            <th>Status</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu.map((m) => (
                            <tr key={m.id} style={{ opacity: m.is_active ? 1 : 0.5 }}>
                                <td>
                                    {m.image_url ? (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: `url(${m.image_url.startsWith('http') ? m.image_url : '/' + m.image_url}) center/cover` }} />
                                    ) : (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            {m.emoji_fallback || '🍽️'}
                                        </div>
                                    )}
                                </td>
                                <td style={{ fontWeight: 600 }}>{m.nome}</td>
                                <td>{m.categoria}</td>
                                <td>€{Number(m.prezzo).toFixed(2)}</td>
                                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {m.descrizione || '—'}
                                </td>
                                <td>
                                    <input type="checkbox" checked={m.mostra_in_home} onChange={() => toggleHome(m)} title="Mostra in Home" />
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${m.is_active ? styles.statusActive : styles.statusSuspended}`}>
                                        {m.is_active ? '● Attivo' : '● Sospeso'}
                                    </span>
                                </td>
                                <td>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} onClick={() => setEditModal({ ...m })}>Modifica</button>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnSuspend}`} onClick={() => toggleActive(m)}>
                                        {m.is_active ? 'Sospendi' : 'Riattiva'}
                                    </button>
                                    <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleDelete(m.id, m.nome)}>Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setEditModal(null)} />
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setEditModal(null)}>✕</button>
                        <h3 className={styles.modalTitle}>Modifica Piatto</h3>
                        <p className={styles.modalSubtitle}>Aggiorna i dati di &quot;{editModal.nome}&quot;</p>

                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Nome Piatto</label>
                                <input type="text" value={editModal.nome} onChange={(e) => setEditModal({ ...editModal, nome: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Categoria</label>
                                <select value={editModal.categoria} onChange={(e) => setEditModal({ ...editModal, categoria: e.target.value })} style={{ width: '100%' }}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Prezzo (€)</label>
                                <input type="number" min={0} step={0.50} value={editModal.prezzo} onChange={(e) => setEditModal({ ...editModal, prezzo: parseFloat(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Emoji Fallback</label>
                                <input type="text" maxLength={2} value={editModal.emoji_fallback} onChange={(e) => setEditModal({ ...editModal, emoji_fallback: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>URL Immagine</label>
                            <input type="url" placeholder="https://..." value={editModal.image_url || ''} onChange={(e) => setEditModal({ ...editModal, image_url: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Descrizione Ingredienti</label>
                            <input type="text" value={editModal.descrizione} onChange={(e) => setEditModal({ ...editModal, descrizione: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Allergeni</label>
                            <input type="text" value={editModal.allergeni || ''} placeholder="Es: Glutine, Lattosio" onChange={(e) => setEditModal({ ...editModal, allergeni: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Descrizione Home Page</label>
                            <textarea value={editModal.descrizione_home || ''} rows={3} onChange={(e) => setEditModal({ ...editModal, descrizione_home: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '24px', display: 'flex', gap: '24px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                <input type="checkbox" checked={editModal.mostra_in_home} onChange={(e) => setEditModal({ ...editModal, mostra_in_home: e.target.checked })} />
                                Mostra in Home
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                <input type="checkbox" checked={editModal.is_active} onChange={(e) => setEditModal({ ...editModal, is_active: e.target.checked })} />
                                Attivo
                            </label>
                        </div>

                        <div className={styles.modalActions}>
                            <button className="btn btn-ghost" onClick={() => setEditModal(null)}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleEditSave} disabled={saving}>
                                {saving ? 'Salvataggio...' : 'Salva su DB'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
