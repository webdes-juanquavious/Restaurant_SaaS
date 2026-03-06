-- ANALYTICS VIEWS v5.1

-- 1. Vista Occupazione Tavoli (Heatmap)
-- Calcola quante volte un tavolo è stato prenotato negli ultimi 30 giorni
CREATE OR REPLACE VIEW public.v_occupazione_tavoli AS
SELECT 
    t.id AS tavolo_id,
    COUNT(p.id) AS totale_prenotazioni,
    ROUND(
        (COUNT(p.id)::DECIMAL / 
        GREATEST(1, (SELECT COUNT(DISTINCT data) FROM prenotazioni WHERE data > CURRENT_DATE - INTERVAL '30 days'))::DECIMAL) * 100, 
        2
    ) AS percentuale_occupazione
FROM 
    public.tavoli t
LEFT JOIN 
    public.prenotazioni p ON t.id = p.tavolo_id AND p.data > CURRENT_DATE - INTERVAL '30 days' AND p.status IN ('confermata', 'presente')
GROUP BY 
    t.id;

-- 2. Vista Trend Piatti (Seasonal Insights)
-- Identifica i piatti più popolari per categoria nell'ultimo mese
CREATE OR REPLACE VIEW public.v_trend_piatti AS
SELECT 
    m.id,
    m.nome,
    m.categoria,
    m.image_url,
    COUNT(f.id) AS feedback_count,
    COALESCE(AVG(f.voto), 0) AS media_voto
FROM 
    public.menu m
LEFT JOIN 
    public.customer_feedback f ON m.id = f.piatto_id AND f.created_at > CURRENT_DATE - INTERVAL '30 days'
WHERE 
    m.is_active = true
GROUP BY 
    m.id, m.nome, m.categoria, m.image_url
ORDER BY 
    media_voto DESC, feedback_count DESC;

-- Grant permissions to authenticated users
GRANT SELECT ON public.v_occupazione_tavoli TO authenticated;
GRANT SELECT ON public.v_trend_piatti TO authenticated;
