'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import type { Message } from '@/types/message'
import { notifyUnreadMessagesChanged } from '@/utils/messageEvents'

// One received message on the Messages page
const MessageCard = ({
  message,
  onDeleted,
}: {
  message: Message
  onDeleted: (id: string) => void
}) => {
  const [isRead, setIsRead] = useState(message.read)
  const [busy, setBusy] = useState(false)

  const handleToggleRead = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !isRead }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? 'Something went wrong')
        return
      }

      setIsRead(data.read)
      notifyUnreadMessagesChanged()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Delete this message? This can't be undone.")) {
      return
    }

    setBusy(true)
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message ?? 'Something went wrong')
        setBusy(false)
        return
      }

      toast.success('Message deleted')
      onDeleted(message._id)
      notifyUnreadMessagesChanged()
    } catch {
      toast.error('Something went wrong')
      setBusy(false)
    }
  }

  return (
    <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>
      {!isRead && (
        <div className='absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md'>
          New
        </div>
      )}
      <h2 className='text-xl mb-4'>
        <span className='font-bold'>Property Inquiry: </span>
        {message.property ? (
          <Link
            href={`/properties/${message.property._id}`}
            className='text-blue-500 hover:text-blue-600'
          >
            {message.property.name}
          </Link>
        ) : (
          <span className='text-gray-500'>(property deleted)</span>
        )}
      </h2>
      <p className='text-gray-700 whitespace-pre-line'>{message.body}</p>

      <ul className='mt-4'>
        <li>
          <strong>Name:</strong> {message.name}
        </li>
        <li>
          <strong>Reply Email: </strong>
          <a href={`mailto:${message.email}`} className='text-blue-500'>
            {message.email}
          </a>
        </li>
        {message.phone && (
          <li>
            <strong>Reply Phone: </strong>
            <a href={`tel:${message.phone}`} className='text-blue-500'>
              {message.phone}
            </a>
          </li>
        )}
        <li>
          <strong>Received:</strong>{' '}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        type='button'
        className={`mt-4 mr-3 py-1 px-3 rounded-md disabled:opacity-50 ${
          isRead ? 'bg-gray-300' : 'bg-blue-500 text-white'
        }`}
        onClick={handleToggleRead}
        disabled={busy}
      >
        {isRead ? 'Mark As Unread' : 'Mark As Read'}
      </button>
      <button
        type='button'
        className='mt-4 bg-red-500 text-white py-1 px-3 rounded-md disabled:opacity-50'
        onClick={handleDelete}
        disabled={busy}
      >
        Delete
      </button>
    </div>
  )
}

export default MessageCard
