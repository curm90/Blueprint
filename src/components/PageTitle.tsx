export default function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className='text-2xl font-semibold'>{title}</h1>
      {subtitle && <h4 className='text-muted-foreground'>{subtitle}</h4>}
    </div>
  )
}
