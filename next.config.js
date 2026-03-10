/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Impede que o app seja embutido em iframes de outros sites (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Impede que o browser adivinhe o tipo do arquivo (MIME sniffing)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Envia apenas a origem no cabeçalho Referer (sem path/query)
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Força HTTPS por 1 ano
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Define de onde cada tipo de recurso pode ser carregado
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",       // Next.js precisa de unsafe-inline
      "style-src 'self' 'unsafe-inline'",         // Tailwind precisa de unsafe-inline
      "img-src 'self' data: https://*.b-cdn.net https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src https://iframe.mediadelivery.net", // Player Bunny Stream
      "media-src https://*.b-cdn.net",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
