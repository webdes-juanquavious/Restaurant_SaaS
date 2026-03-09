import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const { email, password, nome, ruolo } = await req.json();

    if (!email || !password || !nome) {
        return NextResponse.json({ error: 'Email, password e nome sono richiesti.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Create Supabase Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { nome, role: ruolo },
        email_confirm: true, // skip email confirmation
    });

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;
    const { vacanze_annuali, ore_settimanali } = await req.json().catch(() => ({}));

    // 2. Upsert into personale table
    const { error: dbError } = await supabaseAdmin.from('personale').upsert({
        id: userId,
        nome,
        email,
        ruolo,
        status: 'attivo',
        ore_settimanali: ore_settimanali || 40,
        vacanze_annuali: vacanze_annuali || 20,
    }, { onConflict: 'id' });

    if (dbError) {
        console.error('Personale upsert error:', dbError);
    }

    return NextResponse.json({ success: true, userId });
}
