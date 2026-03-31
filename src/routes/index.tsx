import { createFileRoute } from '@tanstack/react-router'
import Homepage from '~/views/Homepage'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className='p-8 flex flex-col gap-16 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
      <Homepage />
    </main>
  )
}
