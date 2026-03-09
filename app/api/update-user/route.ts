import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const { userId, nome, email, ruolo, telefono, oreSettimanali, vacanzeAnnuali, newPassword } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'userId richiesto.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Update Auth User (Email, Password, Metadata)
    const authUpdate: any = {
        user_metadata: { nome, role: ruolo }
    };
    if (newPassword && newPassword.length >= 8) {
        authUpdate.password = newPassword;
    }
    if (email) {
        authUpdate.email = email;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, authUpdate);
    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Update personale table
    const { error: dbError } = await supabaseAdmin.from('personale').update({
        nome,
        email,
        ruolo,
        telefono: telefono || null,
        ore_settimanali: oreSettimanali || 40,
        vacanze_annuali: vacanzeAnnuali || 20,
    }).eq('id', userId);

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
