import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendPasswordResetEmail } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://academy.francaassessoria.com'

    // Generate the recovery link server-side (bypasses Supabase email)
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase().trim(),
      options: {
        redirectTo: `${appUrl}/api/auth/callback?next=/redefinir-senha`,
      },
    })

    if (error || !data?.properties?.action_link) {
      // Return 200 anyway to avoid email enumeration
      return NextResponse.json({ success: true })
    }

    // Get user name for personalization
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
    const name = user?.user_metadata?.full_name || email.split('@')[0]

    // Send branded email via Resend
    await sendPasswordResetEmail({
      to: email.toLowerCase().trim(),
      name,
      resetLink: data.properties.action_link,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
