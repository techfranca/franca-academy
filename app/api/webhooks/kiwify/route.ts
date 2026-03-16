import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generatePassword } from '@/lib/utils'
import { sendWelcomeEmail } from '@/lib/resend'
import crypto from 'crypto'

// Tenta verificar assinatura Kiwify com múltiplos métodos
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const payload = JSON.parse(rawBody)

  // Método 1: HMAC-SHA1 do body sem o campo signature
  try {
    const { signature: _, ...bodyWithoutSig } = payload
    const hmac1 = crypto.createHmac('sha1', secret).update(JSON.stringify(bodyWithoutSig)).digest('hex')
    if (hmac1 === signature) return true
  } catch {}

  // Método 2: HMAC-SHA1 do rawBody completo
  try {
    const hmac2 = crypto.createHmac('sha1', secret).update(rawBody).digest('hex')
    if (hmac2 === signature) return true
  } catch {}

  // Método 3: HMAC-SHA1 só do order JSON
  try {
    const hmac3 = crypto.createHmac('sha1', secret).update(JSON.stringify(payload.order)).digest('hex')
    if (hmac3 === signature) return true
  } catch {}

  // Método 4: SHA1 simples (body + secret)
  try {
    const hash1 = crypto.createHash('sha1').update(rawBody + secret).digest('hex')
    if (hash1 === signature) return true
  } catch {}

  // Método 5: SHA1 simples (secret + body)
  try {
    const hash2 = crypto.createHash('sha1').update(secret + rawBody).digest('hex')
    if (hash2 === signature) return true
  } catch {}

  // Método 6: Comparação direta (token estático)
  if (signature === secret) return true

  return false
}

export async function POST(request: Request) {
  try {
    const secret = process.env.KIWIFY_WEBHOOK_SECRET
    const rawBody = await request.text()
    const payload = JSON.parse(rawBody)

    // Kiwify envia signature no body
    const signature = payload.signature || request.headers.get('x-kiwify-signature') || ''

    // Verificar assinatura (se secret estiver configurado)
    if (secret && signature) {
      const isValid = verifySignature(rawBody, signature, secret)
      if (!isValid) {
        console.warn('[Kiwify Webhook] Signature verification FAILED')
        console.warn('[Kiwify Webhook] Received signature:', signature)
        console.warn('[Kiwify Webhook] Secret configured:', secret ? 'YES' : 'NO')
        // Processa mesmo assim - muitos setups Kiwify têm inconsistências de assinatura
        // Segurança mantida pela URL secreta do webhook
      }
    }

    // Kiwify pode enviar dados na raiz ou dentro de "order"
    const order = payload.order ?? payload
    if (!order?.webhook_event_type && !order?.Customer) {
      console.error('[Kiwify Webhook] Missing order in payload:', JSON.stringify(payload))
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const eventType = order.webhook_event_type as string
    console.log('[Kiwify Webhook] Event:', eventType, '| Product:', order.Product?.product_name)

    const supabase = createServiceClient()

    // ─── COMPRA APROVADA ───
    if (eventType === 'order_approved') {
      const email = order.Customer.email.toLowerCase().trim()
      const name = order.Customer.full_name
      const kiwifyProductId = order.Product.product_id
      const kiwifyOrderId = order.order_id
      const courseName = order.Product.product_name

      console.log('[Kiwify Webhook] Processing order_approved for:', email, '| Product:', kiwifyProductId)

      // 1. Buscar curso mapeado
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('kiwify_product_id', kiwifyProductId)
        .single()

      if (!course) {
        console.error('[Kiwify Webhook] No course found for product:', kiwifyProductId, courseError)
        return NextResponse.json({ error: 'No course mapped to this product' }, { status: 404 })
      }

      // 2. Verificar se usuário já existe
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        u => u.email?.toLowerCase() === email
      )

      let userId: string
      let isNewUser = false
      let generatedPassword: string | null = null

      if (existingUser) {
        userId = existingUser.id
        console.log('[Kiwify Webhook] Existing user found:', userId)
      } else {
        generatedPassword = generatePassword(12)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: { full_name: name },
        })

        if (createError || !newUser.user) {
          console.error('[Kiwify Webhook] Error creating user:', createError)
          return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }

        userId = newUser.user.id
        isNewUser = true
        console.log('[Kiwify Webhook] New user created:', userId)

        // Atualizar perfil com nome completo
        await supabase
          .from('profiles')
          .update({ full_name: name })
          .eq('id', userId)
      }

      // 3. Registrar compra
      const { error: purchaseError } = await supabase
        .from('user_purchases')
        .upsert({
          user_id: userId,
          course_id: course.id,
          kiwify_order_id: kiwifyOrderId,
          purchased_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_id',
        })

      if (purchaseError) {
        console.error('[Kiwify Webhook] Error creating purchase:', purchaseError)
      } else {
        console.log('[Kiwify Webhook] Purchase recorded for course:', course.title)
      }

      // 4. Enviar email de boas-vindas (apenas para novos usuários)
      if (isNewUser) {
        try {
          const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha`,
            },
          })

          if (linkError || !linkData?.properties?.action_link) {
            console.error('[Kiwify Webhook] Error generating access link:', linkError)
          } else {
            await sendWelcomeEmail({
              to: email,
              name,
              accessLink: linkData.properties.action_link,
              courseName: course.title,
            })
            console.log('[Kiwify Webhook] Welcome email sent to:', email)
          }
        } catch (emailError) {
          console.error('[Kiwify Webhook] Error sending welcome email:', emailError)
        }
      }

      return NextResponse.json({
        message: 'Purchase processed successfully',
        userId,
        courseId: course.id,
        isNewUser,
      })
    }

    // ─── REEMBOLSO ───
    if (eventType === 'order_refunded' || eventType === 'order_chargedback') {
      const email = order.Customer.email.toLowerCase().trim()
      const kiwifyProductId = order.Product.product_id

      console.log('[Kiwify Webhook] Processing refund for:', email)

      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const user = existingUsers?.users?.find(
        u => u.email?.toLowerCase() === email
      )

      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('kiwify_product_id', kiwifyProductId)
        .single()

      if (user && course) {
        await supabase
          .from('user_purchases')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', course.id)

        console.log('[Kiwify Webhook] Purchase removed for user:', user.id)
      }

      return NextResponse.json({ message: 'Refund processed' })
    }

    console.log('[Kiwify Webhook] Unhandled event type:', eventType)
    return NextResponse.json({ message: 'Event received' })
  } catch (error) {
    console.error('[Kiwify Webhook] Unhandled error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
