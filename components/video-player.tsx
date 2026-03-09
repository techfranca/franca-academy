'use client'

interface VideoPlayerProps {
  embedUrl: string
  title: string
}

export function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-brand-navy" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
