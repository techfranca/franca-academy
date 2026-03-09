import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

interface WelcomeEmailParams {
  to: string
  name: string
  password: string
  courseName: string
}

export async function sendWelcomeEmail({ to, name, password, courseName }: WelcomeEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://academy.francaassessoria.com'
  const firstName = name.split(' ')[0]

  return getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Franca Academy <noreply@francaassessoria.com>',
    to,
    subject: `Bem-vindo(a) à Franca Academy! Seu acesso ao ${courseName}`,
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

      <p style="color:#081534;font-size:16px;line-height:1.6;margin:0 0 16px;">
        Sua compra do <strong>${courseName}</strong> foi confirmada com sucesso!
        Abaixo estão seus dados de acesso à plataforma:
      </p>

      <!-- Credentials Box -->
      <div style="background-color:#f2fcf4;border:2px solid #7de08d;border-radius:8px;padding:24px;margin:24px 0;">
        <p style="color:#081534;font-size:14px;margin:0 0 12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
          Seus dados de acesso
        </p>
        <p style="color:#081534;font-size:16px;margin:0 0 8px;">
          <strong>Email:</strong> ${to}
        </p>
        <p style="color:#081534;font-size:16px;margin:0;">
          <strong>Senha:</strong> ${password}
        </p>
      </div>

      <p style="color:#598F74;font-size:14px;line-height:1.5;margin:0 0 24px;">
        Recomendamos que você altere sua senha após o primeiro acesso.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${appUrl}/login"
           style="background-color:#7de08d;color:#081534;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;font-family:'Poppins',Arial,sans-serif;">
          Acessar Plataforma
        </a>
      </div>

      <p style="color:#b2b6c0;font-size:14px;line-height:1.5;margin:0;text-align:center;">
        Se você não realizou esta compra, entre em contato conosco.
      </p>
    </div>

    <!-- Footer -->
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

interface PasswordResetEmailParams {
  to: string
  name: string
  resetLink: string
}

export async function sendPasswordResetEmail({ to, name, resetLink }: PasswordResetEmailParams) {
  const firstName = name.split(' ')[0]

  return getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Franca Academy <noreply@francaassessoria.com>',
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
