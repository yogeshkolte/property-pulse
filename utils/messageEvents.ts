// Browser event fired when messages are read, unread or deleted, so the
// navbar's unread count updates straight away instead of on its next check
const UNREAD_CHANGED = 'property-pulse:unread-messages-changed'

export const notifyUnreadMessagesChanged = () => {
  window.dispatchEvent(new Event(UNREAD_CHANGED))
}

export const onUnreadMessagesChanged = (callback: () => void) => {
  window.addEventListener(UNREAD_CHANGED, callback)
  return () => window.removeEventListener(UNREAD_CHANGED, callback)
}
