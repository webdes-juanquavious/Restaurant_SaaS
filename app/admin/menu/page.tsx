'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string; // Ingredienti / breve
    descrizioneHome?: string; // Descrizione lunga per Home Page
    allergeni?: string; // Allergeni
    mostraInHome: boolean; // Slider in Home
    imageUrl?: string;
    emojiFallback: string;
    status: 'active' | 'suspended';
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' };

const initialMenu: MenuItem[] = [
    { id: 1, name: 'Crudo di Mare', category: 'Antipasti', price: 18, description: 'Selezione di pesce crudo marinato con agrumi e olio EVO.', descrizioneHome: 'Un antipasto fresco e leggero, ideale per iniziare con il sapore del mare aperto.', allergeni: 'Pesce, Crostacei', mostraInHome: true, imageUrl: '/dishes/crudo.png', emojiFallback: '🦐', status: 'active' },
    { id: 2, name: 'Carpaccio di Polpo', category: 'Antipasti', price: 16, description: 'Tenerissimo polpo con patate e essenze mediterranee.', descrizioneHome: 'Tenerissimo polpo aromatizzato con essenze mediterranee e olio EVO locale.', allergeni: 'Molluschi', mostraInHome: true, imageUrl: '/dishes/polpo.png', emojiFallback: '🐙', status: 'active' },
    { id: 3, name: 'Branzino al Sale', category: 'Secondi', price: 28, description: 'Branzino locale pescato all\'alba.', descrizioneHome: 'Cotto lentamente nel sale marino integrale per mantenere intatti tutti i succhi.', allergeni: 'Pesce', mostraInHome: true, imageUrl: '/dishes/branzino.png', emojiFallback: '🐟', status: 'active' },
    { id: 4, name: 'Spaghetti allo Scoglio', category: 'Primi', price: 22, description: 'Spaghetti con frutti di mare freschi.', descrizioneHome: 'Il classico primo di mare della nostra tradizione locale, con pasta trafilata al bronzo.', allergeni: 'Glutine, Molluschi, Crostacei', mostraInHome: true, imageUrl: '/dishes/scoglio.png', emojiFallback: '🍝', status: 'active' },
    { id: 5, name: 'Risotto ai Frutti di Mare', category: 'Primi', price: 20, description: 'Risotto mantecato con gamberi e zafferano.', descrizioneHome: 'Dal mare alla tavola, un risotto mantecato a regola d\'arte con un tocco di zafferano.', allergeni: 'Crostacei, Molluschi', mostraInHome: true, imageUrl: '/dishes/risotto.png', emojiFallback: '🍚', status: 'active' },
];

const categories = ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Bevande'];

export default function AdminMenuPage() {
    const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
    const [newDish, setNewDish] = useState({ name: '', category: 'Antipasti', price: '', description: '', descrizioneHome: '', allergeni: '', mostraInHome: false, imageUrl: '', emojiFallback: '🍽️' });
    const [editModal, setEditModal] = useState<MenuItem | null>(null);

    const handleAdd = () => {
        if (!newDish.name || !newDish.price) return;
        setMenu([...menu, {
            id: Date.now(),
            name: newDish.name,
            category: newDish.category,
            price: parseFloat(newDish.price),
            description: newDish.description,
            descrizioneHome: newDish.descrizioneHome,
            allergeni: newDish.allergeni,
            mostraInHome: newDish.mostraInHome,
            imageUrl: newDish.imageUrl || undefined,
            emojiFallback: newDish.emojiFallback || '🍽️',
            status: 'active',
        }]);
        setNewDish({ name: '', category: 'Antipasti', price: '', description: '', descrizioneHome: '', allergeni: '', mostraInHome: false, imageUrl: '', emojiFallback: '🍽️' });
    };

    const toggleSuspend = (id: number) => {
        setMenu(menu.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m));
    };

    const handleDelete = (id: number) => {
        if (confirm('Sei sicuro di voler eliminare questo piatto?')) {
            setMenu(menu.filter(m => m.id !== id));
        }
    };

    const handleEditSave = () => {
        if (!editModal) return;
        setMenu(menu.map(m => m.id === editModal.id ? editModal : m));
        setEditModal(null);
    };

    return (
        <>
            <h2 className={styles.pageTitle}>Gestione Menu</h2>
            <p className={styles.pageSubtitle}>
                Aggiungi, modifica o sospendi i piatti del menu. 
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, marginLeft: '8px' }}>
                    I dati saranno sincronizzati con Supabase.
                </span>
            </p>

            {/* ============ ADD DISH FORM ============ */}

            {/* Add Dish Form */}
            <div className={styles.formPanel}>
                <h3 className={styles.formPanelTitle}>Nuovo Piatto</h3>
                <div className={styles.formRow}>
                    <div>
                        <label style={labelStyle}>Nome Piatto</label>
                        <input type="text" placeholder="Nome del piatto" value={newDish.name} onChange={(e) => setNewDish({ ...newDish, name: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={labelStyle}>CATEGORIA</label>
                        <select value={newDish.category} onChange={(e) => setNewDish({ ...newDish, category: e.target.value })} style={{ width: '100%' }}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>PREZZO (€)</label>
                        <input type="number" placeholder="0.00" min="0" step="0.50" value={newDish.price} onChange={(e) => setNewDish({ ...newDish, price: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={labelStyle}>EMOJI (FALLBACK)</label>
                        <input type="text" placeholder="Es: 🍽️" maxLength={2} value={newDish.emojiFallback} onChange={(e) => setNewDish({ ...newDish, emojiFallback: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div style={{ flex: '2' }}>
                        <label style={labelStyle}>URL IMMAGINE (OPZIONALE)</label>
                        <input type="url" placeholder="https://..." value={newDish.imageUrl} onChange={(e) => setNewDish({ ...newDish, imageUrl: e.target.value })} style={{ width: '100%' }} />
                    </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>DESCRIZIONE <span style={{ color: 'var(--color-error)' }}>(descrizione piatto con ingredienti)</span></label>
                    <input type="text" placeholder="Breve descrizione (max X char)" value={newDish.description} onChange={(e) => setNewDish({ ...newDish, description: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>DESCRIZIONE <span style={{ color: 'var(--color-error)' }}>(per presentazione HOME page)</span></label>
                    <input type="text" placeholder="Breve descrizione (max X char)" value={newDish.descrizioneHome} onChange={(e) => setNewDish({ ...newDish, descrizioneHome: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div className={styles.formRow}>
                    <div>
                        <label style={labelStyle}>ALLERGENI</label>
                        <input type="text" placeholder="Es: Glutine, Crostacei..." value={newDish.allergeni} onChange={(e) => setNewDish({ ...newDish, allergeni: e.target.value })} style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={newDish.mostraInHome} onChange={(e) => {
                                const count = menu.filter(m => m.mostraInHome).length;
                                if (e.target.checked && count >= 5) {
                                    alert('Puoi selezionare un massimo di 5 piatti per la Home Page.');
                                    return;
                                }
                                setNewDish({ ...newDish, mostraInHome: e.target.checked })
                            }} />
                            <span style={{ color: newDish.mostraInHome ? 'var(--color-primary)' : 'inherit' }}>
                                Mostra in Home (Max 5)
                            </span>
                        </label>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={handleAdd} style={{ marginTop: '16px' }}>Aggiungi Piatto</button>
            </div>

            {/* Menu Table */}
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Prezzo</th>
                        <th>Ingredienti</th>
                        <th>Vetrina Home</th>
                        <th>Status</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map((m) => (
                        <tr key={m.id}>
                            <td>
                                {m.imageUrl ? (
                                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: `url(${m.imageUrl}) center/cover` }} title="Immagine Piatto" />
                                ) : (
                                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '1.5rem' }} title="Fallback Emoji">
                                        {m.emojiFallback}
                                    </div>
                                )}
                            </td>
                            <td style={{ fontWeight: 600 }}>{m.name}</td>
                            <td>{m.category}</td>
                            <td>€{m.price.toFixed(2)}</td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {m.description || '—'}
                            </td>
                            <td>
                                <input type="checkbox" checked={m.mostraInHome} onChange={(e) => {
                                    const isChecking = e.target.checked;
                                    if (isChecking && menu.filter(x => x.mostraInHome).length >= 5) {
                                        alert('Puoi mostrare un massimo di 5 piatti nella Home Page.');
                                        return;
                                    }
                                    setMenu(menu.map(item => item.id === m.id ? { ...item, mostraInHome: isChecking } : item));
                                }} />
                            </td>
                            <td>
                                <span className={`${styles.statusBadge} ${m.status === 'active' ? styles.statusActive : styles.statusSuspended}`}>
                                    {m.status === 'active' ? '● Attivo' : '● Sospeso'}
                                </span>
                            </td>
                            <td>
                                <button className={`${styles.actionBtn} ${styles.actionBtnEdit}`} onClick={() => setEditModal({ ...m })}>Modifica</button>
                                <button className={`${styles.actionBtn} ${styles.actionBtnSuspend}`} onClick={() => toggleSuspend(m.id)}>
                                    {m.status === 'active' ? 'Sospendi' : 'Riattiva'}
                                </button>
                                <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleDelete(m.id)}>Elimina</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ============ EDIT MODAL ============ */}
            {editModal && (
                <div className={styles.modal}>
                    <div className={styles.modalOverlay} onClick={() => setEditModal(null)} />
                    <div className={styles.modalContent}>
                        <button className={styles.modalClose} onClick={() => setEditModal(null)}>✕</button>
                        <h3 className={styles.modalTitle}>Modifica Piatto</h3>
                        <p className={styles.modalSubtitle}>Modifica i dati di &quot;{editModal.name}&quot;</p>

                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Nome Piatto</label>
                                <input type="text" value={editModal.name}
                                    onChange={(e) => setEditModal({ ...editModal, name: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Categoria</label>
                                <select value={editModal.category}
                                    onChange={(e) => setEditModal({ ...editModal, category: e.target.value })} style={{ width: '100%' }}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>Prezzo (€)</label>
                                <input type="number" min={0} step={0.50} value={editModal.price}
                                    onChange={(e) => setEditModal({ ...editModal, price: parseFloat(e.target.value) || 0 })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select value={editModal.status}
                                    onChange={(e) => setEditModal({ ...editModal, status: e.target.value as 'active' | 'suspended' })} style={{ width: '100%' }}>
                                    <option value="active">Attivo</option>
                                    <option value="suspended">Sospeso</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div>
                                <label style={labelStyle}>URL Immagine (Opzionale)</label>
                                <input type="url" placeholder="https://..." value={editModal.imageUrl || ''}
                                    onChange={(e) => setEditModal({ ...editModal, imageUrl: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Emoji (Fallback)</label>
                                <input type="text" placeholder="Es: 🐟" maxLength={2} value={editModal.emojiFallback}
                                    onChange={(e) => setEditModal({ ...editModal, emojiFallback: e.target.value })} style={{ width: '100px' }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Ingredienti (Breve)</label>
                            <input type="text" value={editModal.description}
                                onChange={(e) => setEditModal({ ...editModal, description: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Allergeni</label>
                            <input type="text" value={editModal.allergeni || ''} placeholder="Es: Glutine, Lattosio"
                                onChange={(e) => setEditModal({ ...editModal, allergeni: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Descrizione Estesa (Per la Home Page)</label>
                            <textarea value={editModal.descrizioneHome || ''} rows={3}
                                onChange={(e) => setEditModal({ ...editModal, descrizioneHome: e.target.value })} style={{ width: '100%' }} />
                        </div>

                        <div className={styles.modalActions}>
                            <button className="btn btn-ghost" onClick={() => setEditModal(null)}>Annulla</button>
                            <button className="btn btn-primary" onClick={handleEditSave}>Salva Modifiche</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
