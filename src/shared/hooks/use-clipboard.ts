import { useState, useCallback } from "react"

export function useClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text)
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), timeout)
        } catch (error) {
          console.error("Failed to copy text: ", error)
        }
      }
    },
    [timeout]
  )

  return { copy, isCopied }
}