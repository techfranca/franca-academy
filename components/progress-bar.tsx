interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export function ProgressBar({ progress, size = 'md', showLabel = true }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-body-small">
          <span className="text-brand-navy-light-active">Progresso</span>
          <span className="font-semibold text-brand-navy">{progress}%</span>
        </div>
      )}
      <div className={`bg-brand-navy-light rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className="h-full bg-brand-green rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
