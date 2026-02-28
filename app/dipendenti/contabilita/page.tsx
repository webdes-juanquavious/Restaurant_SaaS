'use client';

import { useState } from 'react';
import styles from '../../admin/admin.module.css';

/* ---- Types ---- */
interface OrderItem {
  id: number;
  piatto: string;
  prezzo: number;
  qty: number;
}

interface ExtraCost {
  id: number;
  label: string;
  totale: number;
}

interface TavoloOrder {
  tavoloId: number;
  tavolo: string;
  persone: number;
  ordini: OrderItem[];
  extra: ExtraCost[];
  status: 'aperto' | 'chiuso';
}

const mockTavoliOrders: TavoloOrder[] = [
  {
    tavoloId: 1, tavolo: 'Tavolo #1', persone: 4, status: 'aperto',
    ordini: [
      { id: 1, piatto: 'Crudo di Mare', prezzo: 18, qty: 2 },
      { id: 2, piatto: 'Spaghetti allo Scoglio', prezzo: 22, qty: 2 },
      { id: 3, piatto: 'Branzino al Sale', prezzo: 28, qty: 1 },
      { id: 4, piatto: 'Vino Bianco', prezzo: 5, qty: 4 },
    ],
    extra: [
      { id: 101, label: 'Coperto (4 pers.)', totale: 10 },
      { id: 102, label: 'Supplemento tempo extra', totale: 5 },
    ],
  },
  {
    tavoloId: 3, tavolo: 'Tavolo #3', persone: 2, status: 'aperto',
    ordini: [
      { id: 5, piatto: 'Linguine all\'Astice', prezzo: 28, qty: 2 },
      { id: 6, piatto: 'Tiramisù Marinaro', prezzo: 8, qty: 2 },
    ],
    extra: [
      { id: 103, label: 'Coperto (2 pers.)', totale: 5 },
    ],
  },
];

export default function DipendentiContabilitaPage() {
  const [tavoliOrders] = useState<TavoloOrder[]>(mockTavoliOrders);
  const [selectedTavolo, setSelectedTavolo] = useState<number>(mockTavoliOrders[0]?.tavoloId || 0);
  const [splitMode, setSplitMode] = useState<'unico' | 'separato'>('unico');
  const [personPayments, setPersonPayments] = useState<Record<number, { items: number[]; extras: number[]; paid: boolean }>>({});
  const [currentPerson, setCurrentPerson] = useState(1);

  const currentOrder = tavoliOrders.find(t => t.tavoloId === selectedTavolo);

  const getOrderTotal = (order: TavoloOrder) => {
    const itemsTotal = order.ordini.reduce((s, o) => s + o.prezzo * o.qty, 0);
    const extraTotal = order.extra.reduce((s, e) => s + e.totale, 0);
    return itemsTotal + extraTotal;
  };

  const getItemsTotal = (order: TavoloOrder) => order.ordini.reduce((s, o) => s + o.prezzo * o.qty, 0);
  const getExtraTotal = (order: TavoloOrder) => order.extra.reduce((s, e) => s + e.totale, 0);

  /* Track which items a person selects for split payment */
  const toggleItemForPerson = (itemId: number) => {
    setPersonPayments(prev => {
      const person = prev[currentPerson] || { items: [], extras: [], paid: false };
      const items = person.items.includes(itemId) ? person.items.filter(i => i !== itemId) : [...person.items, itemId];
      return { ...prev, [currentPerson]: { ...person, items } };
    });
  };

  const toggleExtraForPerson = (extraId: number) => {
    setPersonPayments(prev => {
      const person = prev[currentPerson] || { items: [], extras: [], paid: false };
      const extras = person.extras.includes(extraId) ? person.extras.filter(i => i !== extraId) : [...person.extras, extraId];
      return { ...prev, [currentPerson]: { ...person, extras } };
    });
  };

  const confirmPersonPayment = () => {
    setPersonPayments(prev => ({
      ...prev,
      [currentPerson]: { ...(prev[currentPerson] || { items: [], extras: [] }), paid: true }
    }));
    setCurrentPerson(currentPerson + 1);
  };

  const getPersonTotal = (personNum: number) => {
    if (!currentOrder) return 0;
    const person = personPayments[personNum];
    if (!person) return 0;
    const itemsT = person.items.reduce((s, id) => {
      const item = currentOrder.ordini.find(o => o.id === id);
      return s + (item ? item.prezzo * item.qty : 0);
    }, 0);
    const extrasT = person.extras.reduce((s, id) => {
      const extra = currentOrder.extra.find(e => e.id === id);
      return s + (extra ? extra.totale : 0);
    }, 0);
    return itemsT + extrasT;
  };

  const getPaidTotal = () => {
    return Object.keys(personPayments).reduce((s, k) => {
      const p = personPayments[Number(k)];
      return p.paid ? s + getPersonTotal(Number(k)) : s;
    }, 0);
  };

  const handleCloseConto = () => {
    if (!currentOrder) return;
    alert(`Conto chiuso per ${currentOrder.tavolo}! Totale: €${getOrderTotal(currentOrder).toFixed(2)}`);
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Contabilità — Chiusura Conti</h2>
      <p className={styles.pageSubtitle}>Chiudi il conto dei tavoli, dividi il pagamento o paga tutto insieme.</p>

      {/* Table Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tavoliOrders.filter(t => t.status === 'aperto').map(t => (
          <button
            key={t.tavoloId}
            onClick={() => { setSelectedTavolo(t.tavoloId); setSplitMode('unico'); setPersonPayments({}); setCurrentPerson(1); }}
            className={`${styles.actionBtn} ${t.tavoloId === selectedTavolo ? styles.actionBtnEdit : ''}`}
            style={{
              padding: '10px 20px',
              fontSize: '0.88rem',
              background: t.tavoloId === selectedTavolo ? 'var(--color-primary)' : 'var(--bg-surface-elevated)',
              color: t.tavoloId === selectedTavolo ? 'var(--text-on-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {t.tavolo} ({t.persone} pers.)
          </button>
        ))}
      </div>

      {currentOrder && (
        <div className={styles.formPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 className={styles.formPanelTitle} style={{ marginBottom: 0 }}>
              {currentOrder.tavolo} — {currentOrder.persone} persone
            </h3>
            <div style={{ display: 'flex', gap: '0', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => { setSplitMode('unico'); setPersonPayments({}); setCurrentPerson(1); }}
                style={{
                  padding: '8px 20px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  background: splitMode === 'unico' ? 'var(--color-primary)' : 'var(--bg-surface)',
                  color: splitMode === 'unico' ? 'var(--text-on-primary)' : 'var(--text-muted)',
                  border: 'none', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Conto Unico</button>
              <button
                onClick={() => { setSplitMode('separato'); setPersonPayments({}); setCurrentPerson(1); }}
                style={{
                  padding: '8px 20px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  background: splitMode === 'separato' ? 'var(--color-primary)' : 'var(--bg-surface)',
                  color: splitMode === 'separato' ? 'var(--text-on-primary)' : 'var(--text-muted)',
                  border: 'none', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Conto Separato</button>
            </div>
          </div>

          {/* Order Items */}
          <table className={styles.dataTable} style={{ marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Piatto</th>
                <th>Qty</th>
                <th>Prezzo Unit.</th>
                <th>Subtotale</th>
                {splitMode === 'separato' && <th>Seleziona</th>}
              </tr>
            </thead>
            <tbody>
              {currentOrder.ordini.map(item => {
                const isSelectedByAny = Object.values(personPayments).some(p => p.items.includes(item.id));
                const isSelectedByCurrent = personPayments[currentPerson]?.items.includes(item.id);
                const isPaidByOther = Object.entries(personPayments).some(([k, p]) => Number(k) !== currentPerson && p.paid && p.items.includes(item.id));
                return (
                  <tr key={item.id} style={{ opacity: isPaidByOther ? 0.4 : 1 }}>
                    <td>{item.piatto}</td>
                    <td>{item.qty}</td>
                    <td>€{item.prezzo.toFixed(2)}</td>
                    <td style={{ fontWeight: 600 }}>€{(item.prezzo * item.qty).toFixed(2)}</td>
                    {splitMode === 'separato' && (
                      <td>
                        {isPaidByOther ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>✓ Pagato</span>
                        ) : (
                          <input type="checkbox" checked={isSelectedByCurrent} onChange={() => toggleItemForPerson(item.id)} />
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Extra Costs */}
          {currentOrder.extra.length > 0 && (
            <>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Costi Extra</h4>
              <table className={styles.dataTable} style={{ marginBottom: '16px' }}>
                <tbody>
                  {currentOrder.extra.map(extra => {
                    const isPaidByOther = Object.entries(personPayments).some(([k, p]) => Number(k) !== currentPerson && p.paid && p.extras.includes(extra.id));
                    const isSelectedByCurrent = personPayments[currentPerson]?.extras.includes(extra.id);
                    return (
                      <tr key={extra.id} style={{ opacity: isPaidByOther ? 0.4 : 1 }}>
                        <td>{extra.label}</td>
                        <td style={{ fontWeight: 600, color: 'var(--color-warning)' }}>€{extra.totale.toFixed(2)}</td>
                        {splitMode === 'separato' && (
                          <td>
                            {isPaidByOther ? (
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>✓ Pagato</span>
                            ) : (
                              <input type="checkbox" checked={isSelectedByCurrent} onChange={() => toggleExtraForPerson(extra.id)} />
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {/* Totals */}
          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
            {splitMode === 'unico' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Piatti: €{getItemsTotal(currentOrder).toFixed(2)}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Extra: €{getExtraTotal(currentOrder).toFixed(2)}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginTop: '4px' }}>
                    Totale: €{getOrderTotal(currentOrder).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Diviso per {currentOrder.persone}: <strong>€{(getOrderTotal(currentOrder) / currentOrder.persone).toFixed(2)}</strong> a persona
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleCloseConto}>
                  Chiudi Conto
                </button>
              </div>
            ) : (
              <div>
                {/* Per-person payment status */}
                {Object.entries(personPayments).filter(([, p]) => p.paid).map(([num]) => (
                  <div key={num} style={{ padding: '8px 12px', marginBottom: '8px', background: 'rgba(76,175,80,0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-success)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>✓ Persona {num} — Pagato</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>€{getPersonTotal(Number(num)).toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                      Persona {currentPerson} — seleziona le pietanze
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Selezionato: <strong style={{ color: 'var(--color-primary)' }}>€{getPersonTotal(currentPerson).toFixed(2)}</strong>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Già pagato: €{getPaidTotal().toFixed(2)} — Restante: <strong>€{(getOrderTotal(currentOrder) - getPaidTotal() - getPersonTotal(currentPerson)).toFixed(2)}</strong>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={confirmPersonPayment}
                    style={{ opacity: getPersonTotal(currentPerson) > 0 ? 1 : 0.5 }}>
                    Conferma Pagamento Persona {currentPerson}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
