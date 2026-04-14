export default function PageTitle({
  title,
  subtitle,
  className,
}: {
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={className}>
      <h1 className='text-2xl font-semibold'>{title}</h1>
      {subtitle && <h4 className='text-muted-foreground'>{subtitle}</h4>}
    </div>
  )
}
