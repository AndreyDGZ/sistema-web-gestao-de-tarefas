import { useEffect, useState } from 'react'

export function useToast() {
  const [toastMessage, setToastMessage] = useState('')

  function showToast(message: string) {
    setToastMessage(message)
  }

  useEffect(() => {
    if (!toastMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2500)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  return {
    toastMessage,
    showToast,
  }
}
