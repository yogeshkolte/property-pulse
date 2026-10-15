'use client'

import { useEffect, useState } from 'react'
import MessageCard from '@/components/MessageCard'
import Spinner from '@/components/Spinner'
import type { Message } from '@/types/message'

// The signed-in user's received messages. Loaded in the browser, which sends
// the sign-in cookie that the messages API needs.
const Messages = () => {
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    fetch('/api/messages')
      .then(async (res) => {
        const data = await res.json()
        if (ignore) {
          return
        }
        if (!res.ok) {
          setError(data.message ?? 'Failed to load messages')
          return
        }
        setMessages(data)
      })
      .catch(() => {
        if (!ignore) {
          setError('Failed to load messages')
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  if (error) {
    return <p className='text-red-600'>{error}</p>
  }
  if (!messages) {
    return <Spinner />
  }
  if (messages.length === 0) {
    return <p>You have no messages.</p>
  }

  return (
    <div className='space-y-4'>
      {messages.map((message) => (
        <MessageCard
          key={message._id}
          message={message}
          onDeleted={(id) =>
            setMessages((current) =>
              (current ?? []).filter(({ _id }) => _id !== id),
            )
          }
        />
      ))}
    </div>
  )
}

export default Messages
