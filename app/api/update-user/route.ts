import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const { userId, nome, ruolo, telefono, oreSettimanali, newPassword } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'userId richiesto.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Update password if provided
    if (newPassword) {
        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'Password deve essere almeno 8 caratteri.' }, { status: 400 });
        }
        const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: newPassword,
            user_metadata: { nome, role: ruolo }
        });
        if (pwError) {
            return NextResponse.json({ error: pwError.message }, { status: 400 });
        }
    } else {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { nome, role: ruolo }
        });
    }

    // Update personale table
    const { error: dbError } = await supabaseAdmin.from('personale').update({
        nome,
        ruolo,
        telefono: telefono || null,
        ore_settimanali: oreSettimanali || 40,
    }).eq('id', userId);

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
