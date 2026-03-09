import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'userId richiesto.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Dalla tabella personale è gestito da Cascade o va eliminato a mano?
    // Delete Auth User (Supabase cascade deletes from other tables typically if FK relies on auth.users)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Facciamo un fallback per cancellare anche da personale per sicurezza
    await supabaseAdmin.from('personale').delete().eq('id', userId);

    return NextResponse.json({ success: true });
}
