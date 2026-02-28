'use client';

import { useState } from 'react';
import styles from '../../admin/admin.module.css';

/* ---- Tipi base ---- */
type OrderStatus = 'in coda' | 'in preparazione' | 'pronta' | 'consegnata' | 'riportata' | 'pulito';

const menuItems = [
    { id: 1, name: 'Crudo di Mare', price: 18, category: 'Antipasti' },
    { id: 2, name: 'Spaghetti allo Scoglio', price: 22, category: 'Primi' },
    { id: 3, name: 'Risotto ai Frutti di Mare', price: 20, category: 'Primi' },
    { id: 4, name: 'Branzino al Sale', price: 28, category: 'Secondi' },
    { id: 5, name: 'Frittura di Paranza', price: 16, category: 'Secondi' },
    { id: 6, name: 'Tiramisù Marinaro', price: 8, category: 'Dessert' },
    { id: 7, name: 'Vino Bianco', price: 5, category: 'Bevande' },
    { id: 8, name: 'Acqua', price: 2.5, category: 'Bevande' },
];

interface ActiveOrderItem {
    id: number;
    menuId: number;
    name: string;
    qty: number;
    notes: string;
    status: OrderStatus;
    timeAdded: Date;
}

interface ActiveOrder {
    orderId: number;
    tavolo: string;
    items: ActiveOrderItem[];
}

// Mock Data
const mockActiveOrders: ActiveOrder[] = [
    {
        orderId: 101,
        tavolo: 'Tavolo #1',
        items: [
            { id: 1001, menuId: 1, name: 'Crudo di Mare', qty: 2, notes: 'Senza limone', status: 'consegnata', timeAdded: new Date(Date.now() - 15 * 60000) },
            { id: 1002, menuId: 2, name: 'Spaghetti allo Scoglio', qty: 2, notes: '', status: 'pronta', timeAdded: new Date(Date.now() - 14 * 60000) },
        ]
    },
    {
        orderId: 102,
        tavolo: 'Tavolo #3',
        items: [
            { id: 1003, menuId: 4, name: 'Branzino al Sale', qty: 1, notes: '', status: 'in preparazione', timeAdded: new Date(Date.now() - 5 * 60000) },
            { id: 1004, menuId: 7, name: 'Vino Bianco', qty: 2, notes: '', status: 'in coda', timeAdded: new Date(Date.now() - 2 * 60000) },
        ]
    }
];

export default function ComandePage() {
    const [activeTab, setActiveTab] = useState<'nuova' | 'gestione'>('gestione');
    const [selectedTable, setSelectedTable] = useState('Tavolo #1');
    const [newOrderItems, setNewOrderItems] = useState<{ menuId: number, name: string, qty: number, price: number, notes: string }[]>([]);
    
    // Stato comande attive
    const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(mockActiveOrders);

    // ---- FUNZIONI NUOVA COMANDA ---- //
    const addItem = (item: { id: number; name: string; price: number }) => {
        setNewOrderItems((prev) => {
            const existing = prev.find((o) => o.menuId === item.id);
            if (existing) return prev.map((o) => (o.menuId === item.id ? { ...o, qty: o.qty + 1 } : o));
            return [...prev, { menuId: item.id, name: item.name, qty: 1, price: item.price, notes: '' }];
        });
    };

    const updateItemNote = (menuId: number, notes: string) => {
        setNewOrderItems((prev) => prev.map(o => o.menuId === menuId ? { ...o, notes } : o));
    };

    const removeItem = (menuId: number) => {
        setNewOrderItems((prev) => {
            const item = prev.find((o) => o.menuId === menuId);
            if (item && item.qty > 1) return prev.map((o) => (o.menuId === menuId ? { ...o, qty: o.qty - 1 } : o));
            return prev.filter((o) => o.menuId !== menuId);
        });
    };

    const newOrderTotal = newOrderItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleSendToKitchen = () => {
        if (newOrderItems.length === 0) return;
        
        const newActiveItems: ActiveOrderItem[] = newOrderItems.map((o, idx) => ({
            id: Date.now() + idx,
            menuId: o.menuId,
            name: o.name,
            qty: o.qty,
            notes: o.notes,
            status: 'in coda',
            timeAdded: new Date()
        }));

        setActiveOrders(prev => {
            const existingOrderIndex = prev.findIndex(o => o.tavolo === selectedTable);
            if (existingOrderIndex >= 0) {
                const newOrders = [...prev];
                newOrders[existingOrderIndex].items.push(...newActiveItems);
                return newOrders;
            } else {
                return [...prev, { orderId: Date.now(), tavolo: selectedTable, items: newActiveItems }];
            }
        });

        alert(`Comanda per ${selectedTable} inviata in cucina!`);
        setNewOrderItems([]);
        setActiveTab('gestione');
    };

    // ---- FUNZIONI GESTIONE COMANDE ATTIVE ---- //
    const advanceStatus = (orderId: number, itemId: number, currentStatus: OrderStatus) => {
        const flow: Record<OrderStatus, OrderStatus> = {
            'in coda': 'in preparazione',
            'in preparazione': 'pronta',
            'pronta': 'consegnata',
            'consegnata': 'pulito',
            'riportata': 'in coda', // Se riportata, torna in coda per rifarla
            'pulito': 'pulito' // Fine ciclo
        };
        const nextStatus = flow[currentStatus];

        setActiveOrders(prev => prev.map(order => {
            if (order.orderId !== orderId) return order;
            return {
                ...order,
                items: order.items.map(item => item.id === itemId ? { ...item, status: nextStatus } : item)
            };
        }));
    };

    const reportProblem = (orderId: number, itemId: number) => {
         setActiveOrders(prev => prev.map(order => {
            if (order.orderId !== orderId) return order;
            return {
                ...order,
                items: order.items.map(item => item.id === itemId ? { ...item, status: 'riportata' } : item)
            };
        }));
    };

    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case 'in coda': return 'var(--text-muted)';
            case 'in preparazione': return 'var(--color-warning)';
            case 'pronta': return 'var(--color-success)';
            case 'consegnata': return 'var(--color-primary)';
            case 'riportata': return 'var(--color-error)';
            case 'pulito': return '#4caf5020'; // Semi-transparent green
        }
    };

    const countStatus = (items: ActiveOrderItem[], status: OrderStatus | OrderStatus[]) => {
        const statuses = Array.isArray(status) ? status : [status];
        return items.filter(i => statuses.includes(i.status)).length;
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 className={styles.pageTitle} style={{ marginBottom: '4px' }}>Gestione Comande</h2>
                    <p className={styles.pageSubtitle} style={{ marginBottom: 0 }}>Aggiungi ordini e monitora lo stato della cucina.</p>
                </div>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', height: '40px' }}>
                    <button
                        onClick={() => setActiveTab('gestione')}
                        style={{
                            padding: '0 24px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            background: activeTab === 'gestione' ? 'var(--color-primary)' : 'var(--bg-surface)',
                            color: activeTab === 'gestione' ? 'var(--text-on-primary)' : 'var(--text-muted)',
                            border: 'none', textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                        Comande Attive
                    </button>
                    <button
                        onClick={() => setActiveTab('nuova')}
                        style={{
                            padding: '0 24px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            background: activeTab === 'nuova' ? 'var(--color-primary)' : 'var(--bg-surface)',
                            color: activeTab === 'nuova' ? 'var(--text-on-primary)' : 'var(--text-muted)',
                            border: 'none', textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>
                        Nuova Comanda
                    </button>
                </div>
            </div>

            {/* AREA NUOVA COMANDA */}
            {activeTab === 'nuova' && (
                <>
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Seleziona Tavolo
                            </label>
                            <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} style={{ width: '200px' }}>
                                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={`Tavolo #${n}`}>Tavolo #{n}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(350px, 1.2fr)', gap: '32px' }}>
                        {/* Menu Selector */}
                        <div className={styles.formPanel}>
                            <h3 className={styles.formPanelTitle}>Menu — Clicca per aggiungere</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => addItem(item)}
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'transform 0.2s ease, border-color 0.2s',
                                            color: 'var(--text-primary)', fontSize: '0.9rem',
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                    >
                                        <span>{item.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{item.category}</span></span>
                                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>€{item.price.toFixed(2)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Current Selection */}
                        <div className={styles.formPanel}>
                            <h3 className={styles.formPanelTitle}>Comanda — {selectedTable}</h3>
                            {newOrderItems.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
                                    Nessun piatto selezionato.
                                </p>
                            ) : (
                                <>
                                    <table className={styles.dataTable} style={{ marginBottom: '16px' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40%' }}>Piatto</th>
                                                <th>Qty</th>
                                                <th style={{ width: '30%' }}>Note</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newOrderItems.map((item) => (
                                                <tr key={item.menuId}>
                                                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                                                    <td>{item.qty}</td>
                                                    <td>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Note..." 
                                                            value={item.notes} 
                                                            onChange={(e) => updateItemNote(item.menuId, e.target.value)}
                                                            style={{ padding: '6px 8px', fontSize: '0.8rem', width: '100%' }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => removeItem(item.menuId)}>
                                                            −
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Totale Appross.</span>
                                        <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>€{newOrderTotal.toFixed(2)}</span>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleSendToKitchen}>
                                        Invia in Cucina
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* AREA GESTIONE COMANDE ATTIVE */}
            {activeTab === 'gestione' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                    {activeOrders.map(order => {
                        const allItems = order.items.length;
                        const prontaItems = countStatus(order.items, 'pronta');
                        const consegnataItems = countStatus(order.items, 'consegnata');
                        const inCucinaItems = countStatus(order.items, ['in coda', 'in preparazione', 'riportata']);
                        const isAllDone = inCucinaItems === 0 && prontaItems === 0 && consegnataItems > 0;

                        return (
                            <div key={order.orderId} className={styles.card} style={{ 
                                padding: '24px', 
                                borderTop: `4px solid ${prontaItems > 0 ? 'var(--color-success)' : isAllDone ? 'var(--border-color)' : 'var(--color-warning)'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>{order.tavolo}</h3>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {prontaItems > 0 && <span className={styles.badge} style={{ background: 'var(--color-success)' }}>{prontaItems} da Servire!</span>}
                                        {inCucinaItems > 0 && <span className={styles.badge} style={{ background: 'var(--color-warning)' }}>{inCucinaItems} in Cucina</span>}
                                    </div>
                                </div>
                                
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Piatti totali: {allItems}</span>
                                    <span>Consegnati: <strong style={{ color: 'var(--text-primary)' }}>{consegnataItems}</strong></span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {order.items.map(item => (
                                        <div key={item.id} style={{ 
                                            display: 'flex', flexDirection: 'column', gap: '8px', 
                                            padding: '12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                                            borderLeft: `3px solid ${getStatusColor(item.status)}`
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ fontWeight: 600 }}>{item.qty}x {item.name}</span>
                                                    {item.notes && <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '2px', fontStyle: 'italic' }}>Note: {item.notes}</div>}
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px', background: `${getStatusColor(item.status)}20`, color: getStatusColor(item.status) }}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            
                                            {/* Azioni Staff */}
                                            {item.status !== 'pulito' && (
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                                                    {item.status === 'consegnata' && (
                                                        <button onClick={() => reportProblem(order.orderId, item.id)} style={{ padding: '4px 12px', fontSize: '0.7rem', color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: '4px', background: 'none', cursor: 'pointer' }}>Segnala Problema / Riporta</button>
                                                    )}
                                                    <button 
                                                        onClick={() => advanceStatus(order.orderId, item.id, item.status)}
                                                        className={styles.actionBtn}
                                                        style={{ background: 'var(--color-primary)', color: 'var(--text-on-primary)', padding: '4px 16px', fontSize: '0.75rem' }}
                                                    >
                                                        {item.status === 'in coda' ? 'Inizia Prep.' :
                                                         item.status === 'in preparazione' ? 'Segna Pronta' :
                                                         item.status === 'pronta' ? 'Servi al Tavolo' :
                                                         item.status === 'consegnata' ? 'Ritira / Pulito' :
                                                         item.status === 'riportata' ? 'Rifai (Coda)' : ''}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
