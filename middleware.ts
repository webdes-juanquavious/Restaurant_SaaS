import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protezione rotte Admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Qui potremmo aggiungere un check sul ruolo salvato nei metadata dell'utente
    if (session.user.user_metadata.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Protezione rotte Dipendenti
  if (req.nextUrl.pathname.startsWith('/dipendenti')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    const roles = ['admin', 'cameriere', 'cuoco', 'cassiere', 'barman', 'pizzaiolo']
    if (!roles.includes(session.user.user_metadata.role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/dipendenti/:path*'],
}
