import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const router = useRouter()

  useEffect(() => {
router.navigate({to: "/game"})
  },[router])
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
    </div>
  )
}
