import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

interface WelcomeEmailParams {
  to: string
  name: string
  accessLink: string
  courseName: string
}

export async function sendWelcomeEmail({ to, name, accessLink, courseName }: WelcomeEmailParams) {
  const firstName = name.split(' ')[0]

  return getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Franca Academy <contato@francaassessoria.com>',
    to,
    subject: `Seu acesso ao ${courseName} está pronto`,
    headers: {
      'List-Unsubscribe': `<mailto:contato@francaassessoria.com?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f2fcf4;font-family:'Montserrat',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 6px rgba(0,0,0,0.07);">

    <!-- Header -->
    <div style="background-color:#081534;padding:32px 40px;text-align:center;">
      <h1 style="color:#7de08d;font-size:28px;margin:0;font-family:'Poppins',Arial,sans-serif;">Franca Academy</h1>
    </div>

    <!-- Content -->
    <div style="padding:40px;">
      <h2 style="color:#081534;font-size:24px;margin:0 0 16px;font-family:'Poppins',Arial,sans-serif;">
        Olá, ${firstName}! 🎉
      </h2>

      <p style="color:#081534;font-size:16px;line-height:1.6;margin:0 0 24px;">
        Sua compra do <strong>${courseName}</strong> foi confirmada com sucesso!
        Clique no botão abaixo para criar sua senha e acessar a plataforma:
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${accessLink}"
           style="background-color:#7de08d;color:#081534;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;font-family:'Poppins',Arial,sans-serif;">
          Criar minha senha
        </a>
      </div>

      <p style="color:#598F74;font-size:14px;line-height:1.5;margin:0 0 8px;text-align:center;">
        O link é válido por 24 horas.
      </p>

      <p style="color:#b2b6c0;font-size:14px;line-height:1.5;margin:0;text-align:center;">
        Se você não realizou esta compra, entre em contato conosco.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#081534;padding:24px 40px;text-align:center;">
      <p style="color:#b2b6c0;font-size:12px;margin:0;">
        &copy; ${new Date().getFullYear()} Franca Assessoria. Todos os direitos reservados.
      </p>
      <p style="color:#6b7280;font-size:11px;margin:8px 0 0;">
        <a href="mailto:contato@francaassessoria.com?subject=unsubscribe" style="color:#6b7280;">Cancelar recebimento</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  })
}

interface PasswordResetEmailParams {
  to: string
  name: string
  resetLink: string
}

export async function sendPasswordResetEmail({ to, name, resetLink }: PasswordResetEmailParams) {
  const firstName = name.split(' ')[0]

  return getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Franca Academy <contato@francaassessoria.com>',
    to,
    subject: 'Redefinir sua senha - Franca Academy',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f2fcf4;font-family:'Montserrat',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
    <div style="background-color:#081534;padding:32px 40px;text-align:center;">
      <h1 style="color:#7de08d;font-size:28px;margin:0;font-family:'Poppins',Arial,sans-serif;">Franca Academy</h1>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#081534;font-size:24px;margin:0 0 16px;font-family:'Poppins',Arial,sans-serif;">
        Olá, ${firstName}!
      </h2>
      <p style="color:#081534;font-size:16px;line-height:1.6;margin:0 0 24px;">
        Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo:
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetLink}"
           style="background-color:#7de08d;color:#081534;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;font-family:'Poppins',Arial,sans-serif;">
          Redefinir Senha
        </a>
      </div>
      <p style="color:#b2b6c0;font-size:14px;line-height:1.5;margin:0;text-align:center;">
        Se você não solicitou, ignore este email. O link expira em 1 hora.
      </p>
    </div>
    <div style="background-color:#081534;padding:24px 40px;text-align:center;">
      <p style="color:#b2b6c0;font-size:12px;margin:0;">
        &copy; ${new Date().getFullYear()} Franca Assessoria. Todos os direitos reservados.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  })
}
