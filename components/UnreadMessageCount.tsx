'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'react-toastify'
import { onUnreadMessagesChanged } from '@/utils/messageEvents'

// How often to check for new messages while the site is open
const CHECK_INTERVAL_MS = 30_000

// Red badge on the navbar bell with the number of unread messages. Checks
// regularly, and shows a toast when a new message arrives.
const UnreadMessageCount = () => {
  const [count, setCount] = useState(0)
  // The last count seen; null until the first check, so messages that were
  // already waiting don't pop up as "new"
  const lastCount = useRef<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    let ignore = false

    const check = async () => {
      try {
        const res = await fetch('/api/messages/unread-count')
        if (!res.ok || ignore) {
          return
        }
        const { count: newCount }: { count: number } = await res.json()
        if (ignore) {
          return
        }

        if (lastCount.current !== null && newCount > lastCount.current) {
          const added = newCount - lastCount.current
          toast.info(
            added === 1
              ? 'You have a new message'
              : `You have ${added} new messages`,
          )
        }
        lastCount.current = newCount
        setCount(newCount)
      } catch {
        // Offline or server restarting; try again on the next check
      }
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)
    const stopListening = onUnreadMessagesChanged(check)
    // Check as soon as the user comes back to the tab
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        check()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      ignore = true
      clearInterval(interval)
      stopListening()
      document.removeEventListener('visibilitychange', onVisible)
    }
    // Re-check whenever the user moves to another page
  }, [pathname])

  if (count === 0) {
    return null
  }

  return (
    <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
      {count}
      <span className='sr-only'> unread messages</span>
    </span>
  )
}

export default UnreadMessageCount
