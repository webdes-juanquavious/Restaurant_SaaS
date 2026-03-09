'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

const ThemeContext = createContext({
    theme: 'dark',
    setTheme: (theme: string) => { },
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState('dark');
    const supabase = createClient();

    useEffect(() => {
        const fetchTheme = async () => {
            const { data, error } = await supabase
                .from('ristorante_info')
                .select('extra_settings')
                .single();

            if (data?.extra_settings?.tema) {
                const savedTheme = data.extra_settings.tema;
                setTheme(savedTheme);
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
        };

        fetchTheme();

        // Optional: Real-time update if another admin changes it
        const channel = supabase
            .channel('theme-changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'ristorante_info' },
                (payload) => {
                    if (payload.new?.extra_settings?.tema) {
                        const nextTheme = payload.new.extra_settings.tema;
                        setTheme(nextTheme);
                        document.documentElement.setAttribute('data-theme', nextTheme);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
