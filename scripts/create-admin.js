const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your-service-role-key' || !serviceRoleKey.startsWith('ey')) {
  console.error('ERRORE: Devi inserire la SUPABASE_SERVICE_ROLE_KEY reale nel file .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'admin@mare.it'
  const password = 'PasswordSicura123!' 
  const fullName = 'Amministratore Mare Nostrum'

  console.log(`Creazione utente Admin: ${email}...`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { 
      role: 'admin',
      full_name: fullName
    }
  })

  if (error) {
    if (error.message.includes('already exists')) {
        console.log('ℹ️ L\'utente esiste già, procedo con l\'aggiornamento dei metadata...');
    } else {
        console.error('Errore durante la creazione:', error.message)
        return
    }
  }

  // Se l'utente esiste o è stato creato, forziamo i metadata per sicurezza
  const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
    data?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === email).id,
    { user_metadata: { role: 'admin', full_name: fullName } }
  )

  if (updateError) {
    console.error('Errore durante l\'aggiornamento:', updateError.message)
  } else {
    console.log('✅ Utente Admin configurato con successo!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('Ora puoi loggarti nel sistema.')
  }
}

createAdminUser()
