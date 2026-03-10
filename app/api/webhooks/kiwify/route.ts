import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generatePassword } from '@/lib/utils'
import { sendWelcomeEmail } from '@/lib/resend'
import crypto from 'crypto'

// Kiwify webhook event types
type KiwifyEvent = 'order_approved' | 'order_refunded' | 'order_chargedback'

interface KiwifyWebhookPayload {
  order_id: string
  order_status: KiwifyEvent
  product: {
    product_id: string
    product_name: string
  }
  Customer: {
    full_name: string
    email: string
  }
  Subscription?: {
    id: string
    status: string
  }
  signature?: string
}

function verifyKiwifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (sigBuffer.length !== expectedBuffer.length) return false

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer)
}

export async function POST(request: Request) {
  try {
    const secret = process.env.KIWIFY_WEBHOOK_SECRET
    if (!secret) {
      console.error('KIWIFY_WEBHOOK_SECRET is not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    const rawBody = await request.text()
    const body: KiwifyWebhookPayload = JSON.parse(rawBody)

    const signature = request.headers.get('x-kiwify-signature') || body.signature || ''
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    if (!verifyKiwifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabase = createServiceClient()

    if (body.order_status === 'order_approved') {
      const email = body.Customer.email.toLowerCase().trim()
      const name = body.Customer.full_name
      const kiwifyProductId = body.product.product_id
      const kiwifyOrderId = body.order_id
      const courseName = body.product.product_name

      // 1. Find the course mapped to this Kiwify product
      const { data: course } = await supabase
        .from('courses')
        .select('id, title')
        .eq('kiwify_product_id', kiwifyProductId)
        .single()

      if (!course) {
        console.error(`No course found for Kiwify product: ${kiwifyProductId}`)
        // Still return 200 so Kiwify doesn't retry
        return NextResponse.json({ message: 'No course mapped to this product' })
      }

      // 2. Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        u => u.email?.toLowerCase() === email
      )

      let userId: string
      let password: string | null = null

      let isNewUser = false

      if (existingUser) {
        // User already exists, just add the purchase
        userId = existingUser.id
      } else {
        // Create new user with a random password (never shared with the user)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: generatePassword(16),
          email_confirm: true,
          user_metadata: { full_name: name },
        })

        if (createError || !newUser.user) {
          console.error('Error creating user:', createError)
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          )
        }

        userId = newUser.user.id
        isNewUser = true
      }

      // 3. Create purchase record (upsert to avoid duplicates)
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
        console.error('Error creating purchase:', purchaseError)
      }

      // 4. Send welcome email with first-access link (only for new users)
      if (isNewUser) {
        try {
          const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email,
          })

          if (linkError || !linkData?.properties?.action_link) {
            console.error('Error generating access link:', linkError)
          } else {
            await sendWelcomeEmail({
              to: email,
              name,
              accessLink: linkData.properties.action_link,
              courseName: course.title,
            })
          }
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError)
          // Don't fail the webhook for email errors
        }
      }

      return NextResponse.json({
        message: 'Purchase processed successfully',
        userId,
        courseId: course.id,
        isNewUser,
      })
    }

    if (body.order_status === 'order_refunded' || body.order_status === 'order_chargedback') {
      const email = body.Customer.email.toLowerCase().trim()
      const kiwifyProductId = body.product.product_id

      // Find user and course
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
        // Remove purchase
        await supabase
          .from('user_purchases')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', course.id)
      }

      return NextResponse.json({ message: 'Refund processed' })
    }

    return NextResponse.json({ message: 'Event received' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
