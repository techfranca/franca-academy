import CryptoJS from 'crypto-js'

interface BunnySignedUrlParams {
  videoId: string
  expirationTime?: number // seconds from now, default 4 hours
}

export function getBunnyEmbedUrl({ videoId, expirationTime = 14400 }: BunnySignedUrlParams): string {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!
  const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY

  const baseUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`

  // If no token key, return unsigned URL
  if (!tokenKey) return baseUrl

  const expires = Math.floor(Date.now() / 1000) + expirationTime
  const hashableBase = tokenKey + videoId + String(expires)
  const token = CryptoJS.SHA256(hashableBase).toString(CryptoJS.enc.Hex)

  return `${baseUrl}?token=${token}&expires=${expires}`
}

export function getBunnyPlayerProps(videoId: string) {
  return {
    libraryId: process.env.BUNNY_STREAM_LIBRARY_ID!,
    videoId,
  }
}
