import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Carica variabili d'ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your-service-role-key') {
  console.error('ERRORE: Devi inserire la SUPABASE_SERVICE_ROLE_KEY nel file .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'admin@marenostrum.it'
  const password = 'PasswordSicura123!' // Cambiala dopo il primo accesso!
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
    console.error('Errore durante la creazione:', error.message)
  } else {
    console.log('✅ Utente Admin creato con successo!')
    console.log('ID Utente:', data.user.id)
    console.log('Ora puoi loggarti su /login con queste credenziali.')
  }
}

createAdminUser()
